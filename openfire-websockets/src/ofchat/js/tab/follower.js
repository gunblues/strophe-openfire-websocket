/**
 * follower???content script???boss?????assistant??????
 */
 
var follower = (function(){

var _listened = false,
    _port = null,
    $ = null,

/**
 * ???follower
 */
init = function(_$) {
    $ = _$;
    if (!_listened) {
        _listened = true;
        _listen();
    }
},

/**
 * ??boss???
 */
_listen = function() {
    chrome.extension.onConnect.addListener(function(port) {
        _port = port;
        _port.onMessage.addListener(follower._callbackUpdate);
    });
},

_sendRequest = function(data, callbackName) {
    if (_port) {
        _port.postMessage({data: data, callback: callbackName}) ;
    }
},

/**
 * ??boss?????boss???
 */
report = function(reportKey, parameters, callback) {
    if (callback) {
        var callbackName = 'gtalklet_callback_' + $.now() + Math.random();
        window[callbackName] = callback;
    }
    if (!parameters) {
        parameters = {};
    }

    _sendRequest({'report' : reportKey, 'parameters': parameters}, callbackName);
},


/**
 * ??boss??????/??/??assistant??????
 */
_callbackUpdate = function(data, port) {
    var state = data;
       
    if (state.callback) {
        // ??????????
        var callback = state.callback;
        if (window[callback]) {
            window[callback](state.stateChange);
            delete window[callback];
        }
    } else {
        if (state.enable) {
            // disabled => enabled
            assistant.build(state, true);
            _sendRequest({report: 'showPageAction'});
        } else if (state.jingleRequest) {
            assistant.handleJingle(state);            
        } else if (state.disable) {
            // enabled => disabled
            assistant.destroy(true);
            _sendRequest({report: 'showPageAction'});
        } else {
            if ($.isEmptyObject(state.stateChange)) {
                // state???stateChange ??????
                assistant.build(state);
                _sendRequest({report: 'showPageAction'});
            } else {
                // state??stateChange
                // ??????
                assistant.handleStateChange(state.stateChange);
            }
        }
    }
};

return {
    init:init,
    report: report,
    _callbackUpdate: _callbackUpdate
};

})();
