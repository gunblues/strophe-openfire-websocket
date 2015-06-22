/**
 * boss????????????????????follower??
 */
 
var boss = (function(){

var _secretary = null,
    _state = null,
    
    _lastFollowerId = 0,
    _chromeFocused = true,
    _ports = {},

    _option_url = chrome.extension.getURL('options/index.html'),

    _notifications = {},

    excludedUrls = null,

/**
 * ???boss
 */
init = function(secretary, state) {
    _secretary = secretary;    
    _state = state;
    
    _initVersion();
    _processOption();

    // ????
    if (options('AUTO_SIGN_IN') !== false) {
        _secretary.signin();
    }
    
    _listen();
},

/**
 * ???/?? ???
 */
_initVersion = function() {
    var details = chrome.app.getDetails();
    var currentVersion = details.version;
    var previousVersion = options('VERSION');
    if (currentVersion != previousVersion) {
        if (previousVersion) {
            // onUpdated
            // ???????
            chrome.tabs.create({url: chrome.extension.getURL('html/updated.html'), selected: false}); 
        } else {
            // onInstall
            // ??????
            options('BOSH_SERVICE', 'https://localhost:7070');
            options('AUTO_SIGN_IN', true); 
            options('USE_WEBSOCKETS', false);
            options('ALIGN', 'right'); 
            options('HISTORY_THREADS', '2'); 
            options('DESKTOP_NOTIFICATION', true);             
            options('AUTO_IDLE', true); 
            options('EXCLUDES', 'http*://mail.google.com/*\nhttp*://plus.google.com/*\nhttp*://www.facebook.com/*');
    
            chrome.tabs.create({url: chrome.extension.getURL('options/index.html'), selected: true}); 
        }
        options('VERSION', currentVersion);
    }
},

/**
 * ????/????
 */
_processOption = function(key, value) {
    var updated = {};
    if (!key) {
        updated = {
            BOSH_SERVICE: true,
            USE_WEBSOCKETS: true,
            CUSTOM_BOSH_SERVICE: true,
            ALIGN: true,
            HISTORY_THREADS: true,
            DESKTOP_NOTIFICATION: true,
            EXCLUDES: true
        };
    } else {
        updated[key] = true;
    }

    if (updated.ALIGN) {
        options('ALIGN', options('ALIGN'));
    }
    
    if (updated.DESKTOP_NOTIFICATION) {
        options('DESKTOP_NOTIFICATION', options('DESKTOP_NOTIFICATION'));
    }

    if (updated.USE_WEBSOCKETS) {
        options('USE_WEBSOCKETS', options('USE_WEBSOCKETS'));
    }
    
    if (updated.HISTORY_THREADS) {
        options('HISTORY_THREADS', options('HISTORY_THREADS'));
    }
    
    if (updated.EXCLUDES) {
        var urls = options('EXCLUDES').split('\n');
        // ????????
        urls.push('http*://chrome.google.com/webstore*','chrome-*', 'chrome://extensions/*');
        
        for (index in urls) {
            urls[index] = $.convert2RegExp(urls[index]);
        }
        excludedUrls = urls;
    }

    if (updated.CUSTOM_BOSH_SERVICE) 
    {
        if (options('CUSTOM_BOSH_SERVICE')) {
            options('BOSH_SERVICE', options('CUSTOM_BOSH_SERVICE'));
        } else {
            options('BOSH_SERVICE', value);
        }
    }

    if (updated.BOSH_SERVICE || updated.CUSTOM_BOSH_SERVICE || updated.JID || updated.PASSWORD) 
    {
        if (options('BOSH_SERVICE') && options('JID') && options('PASSWORD')) 
        {
            options('CONNECTION_PREPARED', true);
        } else {
            options('CONNECTION_PREPARED', false);
        }
    }
},

/**
 * ????
 */
_listen = function() {
    // ??page action??
    chrome.pageAction.onClicked.addListener(boss._callbackOnClicked);

    // ???????????UI
    chrome.tabs.onUpdated.addListener(boss._callbackOnUpdated);
    
    // ??????tab??follower??????_lastFollower
    chrome.tabs.onSelectionChanged.addListener(boss._callbackOnSelectionChanged);

    chrome.tabs.onDetached.addListener(function(tabId, detachInfo) {
        chrome.tabs.getSelected(detachInfo.oldWindowId, function(tab) {
            if (tab) {
                _sendRequest(tab.id, {stateChange: {report: 'toggleHidden', returns:{hide: true}}});
            }
        })
    });
    
    // ??????
    chrome.windows.onFocusChanged.addListener(boss._callbackOnFocusChanged);
},

/**
 * ??,??follower????????
 */
_callbackOnRequest = function(request, port) {
    var callback = request.callback;
    var request = request.data;
    
    var sender = port;
    if (sender.tab && sender.tab.index >= 0) { // ??index???chrome omnibar instant preview warning??
        switch (request.report) {
            case 'showPageAction':
                // page action ????
                var suffix,title;
                if (followerManager.isEnabled(sender.tab.id, sender.tab)) {
                    suffix = 'enabled';
                    title = 'OfChat Enabled';
                } else {
                    if (followerManager.isExcluded(sender.tab)) {
                        suffix = 'excluded';
                        title = 'URL Excluded';
                    } else {
                        suffix = 'disabled';
                        title = 'OfChat Disabled';
                    }
                }

                chrome.pageAction.setIcon({path: '/icon_' + suffix + '.png', tabId: sender.tab.id});
                chrome.pageAction.setTitle({title: title, tabId: sender.tab.id});
                chrome.pageAction.show(sender.tab.id);
                break;                
            case 'showExtensionOption':
                // ??????tab
                chrome.tabs.getAllInWindow(null,function(tabs){
                    var option_tab = tabs.filter(function(t) { return t.url === _option_url; });
                    
                    if(option_tab.length){
                        // ?????????
                        chrome.tabs.update(option_tab[0].id, {selected: true});
                    }else{
                        chrome.tabs.create({url: _option_url, selected: true});
                    }
                });
                break;
            case 'read':
                // ????????notifications
                this.hideNotifications();
                // ??break
            default:
                // follower?????
                // ???????secretary???
                if (_secretary[request.report]) {
                     _secretary[request.report](request.parameters);
                }
                
                // ???????????
                var stateChange = _state.call(request.report, request.parameters);

                // ?????????follower
                _sendResponse(sender.tab.id, stateChange, callback);
                // ?????????follower
                _sendResponseToAll(stateChange, sender.tab.id);
                break;
        }
    }
},

_callbackOnClicked = function(tab) {
    if (followerManager.isEnabled(tab.id, tab)) {
        // enabled => disable
        _sendRequest(tab.id, {disable: true});
        followerManager.toggle(tab.id, false);
    } else {
        // disabled => enable
        _sendRequest(tab.id, $.extend({}, _state, {enable: true}));
        followerManager.toggle(tab.id, true);
    }
},

/**
 * ???????????UI
 */
_callbackOnUpdated = function(tabId, changeInfo, tab) {
    // ???????UI
    if (changeInfo.status === 'complete') {
        // ??????port???????port,?????disconnected?port
        if (_ports[tabId]) {
            _ports[tabId].disconnect();
            delete _ports[tabId];
        }

        if (!followerManager.isExcluded(tab) && followerManager.isEnabled(tabId, tab)) {
            // ??UI
            _sendRequest(tabId, _state);
            _executeScript(tabId);
        } else {
            // ???UI
            _sendRequest(tabId, {});
            _executeScript(tabId);
        }
    }
},

/**
 * ??????tab??follower??????_lastFollower
 */
_callbackOnSelectionChanged = function(tabId) {
    if (!followerManager.hasRegistered(tabId)) {
        // ????????? ??, ?????
        // ??instant preview ?????
        chrome.tabs.get(tabId, function(tab) {
            // tab?????????chrome???
            if (tab) {
                followerManager.register(tab);
                if (followerManager.isEnabled(tabId, tab)) {
                    _sendRequest(tabId, _state);
                    _executeScript(tabId);
                }
            }
        });
    }

    //??tab
    _sendRequest(tabId, {stateChange: {report: 'toggleHidden', returns:{hide: false}}});
        
    followerManager.updateLastActiveFollower(tabId);
    _lastFollowerId = tabId;
}

/**
 * ????????????follower
 */
_callbackOnFocusChanged = function(windowId) {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        // ?chrome?????chrome??
        chrome.tabs.getSelected(windowId,function(tab){
            if (tab && followerManager.hasRegistered(tab.id)) {
                if (followerManager.isEnabled(_lastFollowerId)) {
                    // ???????tab??UI
                    // ???????????state
                    _sendRequest(_lastFollowerId, {stateChange: {report: 'toggleHidden', returns:{hide: true}}});
                }
                
                // ???????tab??UI
                // ???????????state
                if (followerManager.isEnabled(tab.id)) {
                    _sendRequest(tab.id, {stateChange: {report: 'toggleHidden', returns:{hide: false}}});
                }
            }
                    
			if (tab) {
				_lastFollowerId = tab.id;
			}
        });
        _chromeFocused = true;
    } else {
        // ????chrome???????
        _chromeFocused = false;
    }
},

/**
 * ??port????
 */
_sendRequest = function(tabId, data) {
    if (!_ports[tabId]) {
        // ??port?????
        // ?port??tab???????
        chrome.tabs.get(tabId, function(tab) {
            if (tab) {
                _ports[tabId] = chrome.tabs.connect(tabId, {name: '' + tabId});
                _ports[tabId].onMessage.addListener(boss._callbackOnRequest);
                _ports[tabId].onDisconnect.addListener(function(data){
                    delete _ports[tabId];
                });
                _ports[tabId].tab = tab;
                _ports[tabId].postMessage(data);
            }
        });
    } else {
        // ???????port?????
        _ports[tabId].postMessage(data);
    };
},

/**
 * ???????follower????
 */
_sendResponse = function(followerId, stateChange, callback) {
    _sendRequest(followerId, {stateChange: stateChange, callback: callback});
},

/**
 * ?????????follower
 */
_sendResponseToAll = function(stateChange, exceptFollowerId) {
    exceptFollowerId = exceptFollowerId || NaN;
    var followers = followerManager.get();
    for (followerId in followers) {
        followerId = parseInt(followerId);
        if (followerId != exceptFollowerId && followerManager.isEnabled(followerId)) {
            followerId = followerId || _lastFollowerId;
            _sendRequest(followerId, {'stateChange': stateChange});
        }
    }
},

/**
 * UI??????????
 */
_executeScript = function(tabId) {
    // ????????
    if (options('ALIGN') === 'right') {
        chrome.tabs.executeScript(tabId, {file: 'js/injection/right.js'});
    } else {
        chrome.tabs.executeScript(tabId, {file: 'js/injection/left.js'});
    }
},

/**
 * secretary??report???? ????
 */
report = function(report, parameters){
    // ??state
    var stateChange = _state.call(report, parameters);
    _sendResponseToAll(stateChange);
},

hideNotifications = function() {
    //var n = _notifications[id];
    for(index in _notifications) {
        var n = _notifications[index];
        n && n.cancel();
    }
},

showNotification = function(icon, title, message) {
    if (options('DESKTOP_NOTIFICATION') && (!_chromeFocused || !followerManager.isEnabled(_lastFollowerId))) {
        var encode = function(s) { return s; },
            new_id = Date.now(),
            params = {message:encode(message),title:encode(title),icon:encode(icon),id:new_id,timeout:500000};
        var notification = webkitNotifications.createHTMLNotification(
            chrome.extension.getURL(
                'html/notification.html?params='+encodeURIComponent(JSON.stringify(params))
            )
        );
        notification.show();
        notification.onclose = function() {
            delete _notifications[new_id];
        };
        _notifications[new_id] = notification;
    }
},

/**
 * 
 */
log = function(message, level) {
    chrome.extension.getBackgroundPage().console.log(message);
    
    if (typeof(level) === 'undefined') {
        level = 'info';
    }
    message = '' || message;

    var stateChange = {
        report: 'log',
        returns: {
            message: message,
            level: level
        }
    };
    
    _state.call('log', {message: message, level:level});

    _sendResponseToAll(stateChange);
},

/**
 * ??/??options
 */
options = function(key, value) {
    var realKey = 'store.settings.' + key.toLowerCase();
    if (typeof(value) === 'undefined') {
        if (typeof(localStorage[realKey]) === 'undefined') {
            return '';
        } else {
            return JSON.parse(localStorage[realKey]);
        }
    } else {
        var stateChange = _state.optionUpdated(key, value);
        _sendResponseToAll(stateChange);
        return localStorage[realKey] = JSON.stringify(value);
    }
},

optionUpdated = function(key, value) {
    _processOption(key, value);
},

signout = function() {
    _secretary.signout();
    var stateChange = _state.call('signout', {});
    _sendResponseToAll(stateChange);
},

excludedUrls = function () {
    return excludedUrls;
};

return {
    init: init,
    report: report,
    showNotification: showNotification,
    hideNotifications: hideNotifications,
    log: log,
    options: options,
    optionUpdated: optionUpdated,
    signout: signout,
    excludedUrls: excludedUrls,
    _callbackOnRequest: _callbackOnRequest,
    _callbackOnClicked: _callbackOnClicked,
    _callbackOnSelectionChanged: _callbackOnSelectionChanged,
    _callbackOnUpdated: _callbackOnUpdated,
    _callbackOnFocusChanged: _callbackOnFocusChanged

};

})();



var followerManager = (function(){

    var _followers = {},
        _excludedWindows = [],
        _lastActiveId = 0,
    
init = function() {
    _listen();
},

_listen = function() {
    // ???????
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status === 'loading') {
            register(tab);
        }
    });
    chrome.tabs.onSelectionChanged.addListener(_setSelected);
    chrome.windows.onFocusChanged.addListener(function(windowId) {
        if (windowId !== chrome.windows.WINDOW_ID_NONE) {
            chrome.tabs.getSelected(windowId, function(tab) {
                if (tab) {
                    _setSelected(tab.id);
                }
            })
        }
    });
    chrome.tabs.onAttached.addListener(function(tabId, attachInfo) {
        _followers[tabId].window = attachInfo.newWindowId;
    });
    // ?????????enabledFollower???
    chrome.tabs.onRemoved.addListener(function(tabId) {
        unregister(tabId);
    });

    // ?popup???????
    chrome.windows.onCreated.addListener(function(window) {
        if (window.type == 'popup') {
            // ????id????
            _excludedWindows.push(window.id);
        }
    });
    chrome.windows.onRemoved.addListener(function(windowId) {
        delete _excludedWindows[windowId];
    });
},

_setSelected = function(tabId) {
    for(i in _followers) {
        _followers[i].selected = false;
    }
    if (_followers[tabId]) {
        _followers[tabId].selected = true;
    }
},

/**
 * ????
 */
register = function(tab) {
    if (tab.id && tab.url) {
        var tabId = tab.id;
        var url = tab.url;
        var enabled = !isExcluded(tab);
    
        if (_followers[tabId]) {
            _followers[tabId].url = url;
            _followers[tabId].enabled &= enabled;
            _followers[tabId].selected = tab.selected;
            _followers[tabId].window = tab.windowId;
        } else {
            _followers[tabId] = {url: url, enabled: enabled, selected: tab.selected, window: tab.windowId};
        }
    }
},

/**
 * ??????
 */
unregister = function(followerId) {
    delete _followers[followerId];
},

/**
 * 
 */
hasRegistered = function(tabId) {
    return !!_followers[tabId];
},

/**
 * ???????follower
 */
updateLastActiveFollower = function(followerId) {
    var follower = _followers[followerId];
    if(follower && follower.enabled){
        _lastActiveId = followerId;
    }
},

getLastActiveFollower = function() {
    if (_followers[_lastActiveId]) {
        var last = _followers[_lastActiveId];
        last.id = _lastActiveId;
        return last;
    } else {
        return null;
    }
},

get = function(tabId) {
    if (tabId) {
        if (_followers[tabId]) {
            return _followers[tabId];
        } else {
            return null;
        }
    } else {
        return _followers;
    }
},

/**
 * ??/???????
 */
toggle = function(tabId, enabled) {
    enabled = !!enabled;
    if (_followers[tabId]) {
        _followers[tabId].enabled = enabled;
    }
},

/**
 * ????????????
 */
isEnabled = function(tabId, tab) {
    if (_followers[tabId]) {
        return _followers[tabId].enabled;
    } else {
        if (tab) {
            if (isExcluded(tab)) {
                _followers[tabId] = {enabled: false, url: tab.url, window: tab.windowId};
            } else {
                _followers[tabId] = {enabled: true, url: tab.url, window: tab.windowId};
            }
        }
        return false;
    }
},

/**
 * ?????????????
 */
isExcluded = function(tab) {
    var result = false;
    if (_excludedWindows.indexOf(tab.windowId) > -1) {
        result = true;
    } else {
        var url = tab.url;
        var excludedUrls = boss.excludedUrls();
        for (index in excludedUrls) {
            if (url.match(excludedUrls[index])) {
                result = true;
                break;
            }
        }
    }
    return result;
},

/**
 * ???????
 */
isSelected = function(tabId) {
    if (_followers[tabId] && _followers[tabId].selected) {
        return true;
    } else {
        return false;
    }
};

init();

return {
    register: register,
    unregister: unregister,
    hasRegistered: hasRegistered,
    updateLastActiveFollower: updateLastActiveFollower, 
    getLastActiveFollower: getLastActiveFollower,
    get: get,
    toggle: toggle,
    isEnabled: isEnabled,
    isExcluded: isExcluded,
    isSelected: isSelected,
    _setSelected: _setSelected
};

})();
