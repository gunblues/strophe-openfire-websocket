var com={};com.jive={};com.jive.sparkweb={};com.jive.sparkweb.control={buttons:{login:"login",createAccount:"create-account"},fields:{username:"name",loginusername:"loginname",loginpassword:"loginpassword"},init:function(){var userNameField=com.jive.sparkweb.control.fields["loginusername"];var passwordField=com.jive.sparkweb.control.fields["loginpassword"];var loginButton=getEl(com.jive.sparkweb.control.buttons.login);var loginAction=Event.stop.bind();loginAction=loginAction.createSequence(function(usernameField,passwordField){getEl(usernameField).blur();getEl(passwordField).blur();}.bind(null,userNameField,passwordField));loginAction=loginAction.createSequence(org.jive.spank.control.doConnect.createCallback($F.createCallback(userNameField),$F.createCallback(passwordField),window.location.hostname, com.jive.sparkweb.control.actions));loginButton.addListener("click",loginAction);var createAccountButton=getEl(com.jive.sparkweb.control.buttons.createAccount);if(createAccountButton)
createAccountButton.addListener("click",com.jive.sparkweb.control.createAccount);var accountForm=getEl("jive_sw_account-creation-form");accountForm.setDisplayed(false);getEl("jive_sw_userbar-container").setVisible(false);getEl(userNameField).dom.focus();},createAccount:function(e){var createAccountButton=getEl("btn-create-account");var loginForm=getEl("jive_sw_login-form");var accountForm=getEl("jive_sw_account-creation-form");if(loginForm.isDisplayed()){createAccountButton.replaceClass("btn-create-account","btn-create-account-depressed");loginForm.setDisplayed(false);accountForm.setDisplayed(true);getEl(com.jive.sparkweb.control.fields.username).focus();}
else{createAccountButton.replaceClass("btn-create-account-depressed","btn-create-account");accountForm.setDisplayed(false);loginForm.setDisplayed(true);getEl(com.jive.sparkweb.control.fields.loginusername).focus();}
Event.stop(e);}}

com.jive.sparkweb.control.actions={onConnecting:function(){var loginErrorEl=getEl("login-error");if(loginErrorEl){loginErrorEl.remove();}
getEl("loginname-label").removeClass("jive_red");getEl(com.jive.sparkweb.control.fields["loginusername"]).removeClass("error");getEl("password-label").removeClass("jive_red");getEl(com.jive.sparkweb.control.fields["loginpassword"]).removeClass("error");getEl("jive_sw_login").addClass("jive-login-hidden");var loginError=getEl("login-error");if(loginError){loginError.remove();}
$(com.jive.sparkweb.control.fields["loginpassword"]).value="";document.getElementById("login-version").style.visibility="hidden";var loader=$("jive_loader")
loader.style.visibility="visible";loader.style.display="block";},onConnected:function(){getEl("jive_sw_login-container").setVisible(false);$("jive_loader").style.display="none";getEl("jive_sw_userbar-container").setVisible(true,true);},onDisconnected:function(){getEl("jive_sw_login-container").setVisible(true,true,1);$("jive_loader").style.display="none";getEl("jive_sw_login").removeClass("jive-login-hidden");getEl("jive_sw_userbar-container").setVisible(false,true);},onFailedAuthentication:function(){var template=new YAHOO.ext.DomHelper.Template(com.jive.sparkweb.control.templates.authentication_failed.join(''));template.append("jive_sw_login-form",{});getEl("loginname-label").addClass("jive_red");getEl(com.jive.sparkweb.control.fields["loginusername"]).addClass("error");getEl("password-label").addClass("jive_red");getEl(com.jive.sparkweb.control.fields["loginpassword"]).addClass("error");com.jive.sparkweb.control.actions.onDisconnected();},onError:function(){com.jive.sparkweb.control.actions.onDisconnected();}};YAHOO.ext.EventManager.addListener(window,"load",com.jive.sparkweb.control.init);com.jive.sparkweb.control.templates={create_passwords_dont_match:['<p id="create-error" class="error">',"I'm sorry but your <span class=\"jive_red\"><strong>password's</strong></span>"," did not match. Please re-enter your password and try again.</p>"],authentication_failed:['<p id="login-error" class="error">',"Please enter a valid <span class='jive_red'>username</span> and ","<span class='jive_red'>password</span>.</p>"]}



var jive = {};
jive.spank = {};
jive.spank.chat = {};

var jive_colors = ["red", "blue" , "gray", "magenta", "violet", "olive", "yellowgreen", "darkred", "darkgreen", "darksalmon", "darkcyan", "darkyellow", "mediumpurple", "peru", "olivedrab", "royalred", "darkorange", "slateblue", "slategray", "goldenrod", "orangered", "tomato", "dodgerblue", "steelblue", "deeppink", "saddlebrown", "coral", "royalblue"];

function uniqueColorForString(word) {
	var index = 0;
	for(var i = 0; i < word.length; i++) {
		index += word.charCodeAt(i) * i;
	}
	return jive_colors[index % jive_colors.length];
}

var spank = {
    loadComponent: function(type) {
        if (type == null || type == "") {
            return null;
        }

        var component = spank._createComponent(type);
        var attributes = spank._loadAttributes(type);

        switch (type) {
            case "chat":
                return new jive.spank.chat.ChatWindow(component.id, attributes);
            case "roster":
                return new jive.spank.roster.RosterWindow(component.id, attributes);
            default:
                return null;
        }
    },
    _loadAttributes: function(element) {
        if (!spank.conf || !spank.conf[element]) {
            return {};
        }
        return spank.conf[element];
    },
    _createComponent: function(type) {
        var elm = document.createElement('div');
        elm.id = YAHOO.util.Dom.generateId();
        document.getElementsByTagName('body')[0].appendChild(elm);
        return elm;
    }
};

jive.spank.Window = function(id, title, dialogConfObj) {
    this.bodyId = YAHOO.util.Dom.generateId();
    jive.spank.chat.Template.dialog.append(id, { windowTitle: title, bodyId: this.bodyId });
    this.dialog = new YAHOO.ext.LayoutDialog(id, dialogConfObj);
    this.dialog.addKeyListener(27, this.dialog.hide, this.dialog);

    this.tabs = {};
    this.id = id;
};

YAHOO.extend(jive.spank.Window, YAHOO.ext.util.Observable, {
    isUpdating: false,
    beginUpdate: function() {
        if (!this.isUpdating) {
            this.isUpdating = true;
            this.dialog.beginUpdate();
        }
    },
    endUpdate: function() {
        if (this.isUpdating) {
            this.isUpdating = false;
            this.dialog.endUpdate();
        }
    },
    show: function() {
        this.dialog.show();
    },
    hide: function() {
        this.dialog.hide();
    },
    isVisible: function() {
        return this.dialog.isVisible();
    },
    destroy: function() {
        this.hide();
        this.dialog.destroy(true);
        delete this.dialog;
    }
});

jive.spank.chat.ChatWindow = function(id, attributes) {
    var width = attributes["width"] ? attributes["width"] : YAHOO.util.Dom.getViewportWidth() - 210;
    var height = attributes["height"] ? attributes["height"] : YAHOO.util.Dom.getViewportHeight() - 65;
    
    //var width = attributes["width"] ? attributes["width"] : 520;    
    //var height = attributes["height"] ? attributes["height"] : 450;
    //var x = attributes["x"] ? attributes["x"] : (YAHOO.util.Dom.getViewportWidth() / 2) - 260;
    //var y = attributes["y"] ? attributes["y"] : (YAHOO.util.Dom.getViewportHeight() / 2) - 225;    
    
    var x = attributes["x"] ? attributes["x"] : 210;    
    var y = attributes["y"] ? attributes["y"] : 60;
    var resizable = attributes["resizable"] != "false";
    var draggable = attributes["draggable"] != "false";
    var closable = attributes["closable"] != "false";
    var blinkTab = attributes["blinktab"] == "true";
    var constrained = attributes["constrained"] != "false";
    if (blinkTab) {
        this.notificationInterval = {};
    }
    var confObject = {
        modal: false,
        constraintoviewport: constrained,
        width: width,
        height: height,
        shadow: false,
        proxyDrag: false,
        resizable: false,
        draggable: false,
        minWidth: 300,
        minHeight: 300,
        x: x,
        y: y,
        closable: true
    };
    if (attributes['bottomPane']) {
        confObject = $H(confObject).merge({
            south: {
                autoScroll: false,
                initialSize: 30
            },
            east: {
                split: true,
                initialSize: 170,
                minSize: 50,
                maxSize: 200,
                autoScroll: false,
                collapsible: true
            },
            center: {
                autoScroll: false,
                autoTabs: false
            }
        });
    }
    else {
        confObject = $H(confObject).merge({
            north: {
                autoScroll: false,
                initialSize: 500
            },
            east: {
                split: true,
                initialSize: 105,
                minSize: 50,
                maxSize: 200,
                autoScroll: false,
                collapsible: true
            },
            center: {
                autoScroll: false,
                closeOnTab: true,
                alwaysShowTabs: true,
                autoTabs: false
            }
        });
    }
    jive.spank.chat.ChatWindow.superclass.constructor.call(this, id, "Chat", confObject);
    this.events = {
        "input": true,
        "message": true,
    /**
     * @event mucdblclicked
     * Fires when the user double-clicks a MUC row in a MUC chooser.
     * @param {jive.spank.chat.ChatWindow} chatwindow the window asking for the MUC
     * @param {String} address the MUC's name, for composition with a server to form a JID.
     * @param {String} choosertabId DOM ID of the MUC chooser tab, for optional passing to addMUC for destruction
     */
        "mucdblclicked": true,
        "tabclosed": true,
    /**
     * @event mucinvitation
     * Fires when the user invites a contact to a MUC.
     * @param {jive.spank.chat.ChatWindow} chatwindow ref to the muc's chat window
     * @param {String} userjid JID for the invited user
     * @param {String} roomjid the MUC's JID
     */
        "mucinvitation": true,
    /**
     * @event changenameinmuc
     * Fires when the user submits a nickname change
     * @param {jive.spank.chat.ChatWindow} chatwindow ref to the muc's chat window
     * @param {String} roomjid JID for the MUC in question
     * @param {String} newnick the nick to change to
     */
        "changenameinmuc": true,
    /**
     * @event refreshmuclist
     * Fires when the user wants to refresh that there list of MUCs
     * @param {jive.spank.chat.ChatWindow} chatwindow ref to the muc's chat window
     */
        "refreshmuclist": true,
	/**
	 * @event createmuc
	 * Fires when the user wants to create a MUC
	 */
	    "createmuc": true
    };
    var layout = this.dialog.getLayout();

    layout.regions['center'].addListener("panelremoved", function() {
        if (layout.regions['center'].tabs.items.length == 0) {
            this.dialog.hide();
        }
    }.bind(this));

    this.dialog.addListener("hide", function() {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.removeAllTabs();
        this.dialog.destroy(true);
        //this.dialog.proxy.remove();
        //this.dialog.resizer.proxy.remove();
    }.bind(this));

    this.newMessages = {};
    this._wrappedFns = {};
};
YAHOO.extend(jive.spank.chat.ChatWindow, jive.spank.Window, {

/**
 * Does the heavy HTML lifting for adding a new tab.
 *
 * @param {jive.spank.chat.Contact/String} either a Contact object (or fakey
 * version with name and jid properties) or a jid.
 */
    addTab: function(contactObj) {
        this.dialog.beginUpdate();
        if (typeof contactObj == 'string') {
            var thejid = contactObj;
            contactObj = {name: thejid, jid: thejid};
        }
        
        var tabId = "jive-tab-" + contactObj.jid;

        jive.spank.chat.Template.tab.append(this.bodyId, {tabId: tabId});
        var layout = this.dialog.getLayout();

        var innerLayout = new YAHOO.ext.BorderLayout(tabId + "-layout",
                jive.spank.chat.ChatWindow.tabConfObject);

	if(window.showUpperStuff == "show") {
/*	
	        if (typeof contactObj.jid == 'string') {
			var i = contactObj.jid.indexOf("@");
			
			if (i < 0) {
			    var userid = contactObj.jid;
			}
			else {
			    var userid = contactObj.jid.slice(0, i);
			}
		} else
            		var userid = contactObj.jid.getNode();
*/            
		innerLayout.add('north', new YAHOO.ext.ContentPanel(tabId + '-toppane'));
		//jive.spank.chat.Template.chat_toppane.append(tabId + '-toppane', {tabId: tabId, username: userid});
		jive.spank.chat.Template.chat_toppane.append(tabId + '-toppane', {tabId: tabId});		
		//innerLayout.regions['north'].hide();
        }

        innerLayout.add('center', new YAHOO.ext.ContentPanel(tabId + '-history'));
        //var resizeHandler = textArea.fitToParent.createDelegate(innerLayout.regions('center'));
        //innerLayout.delayedListener("regionresized", resizeHandler, 100);

        // south panel and textarea sizing
        innerLayout = this._layoutTextarea(innerLayout, tabId, contactObj.jid.toString());

        layout.add('center', new YAHOO.ext.NestedLayoutPanel(innerLayout,
        {title: contactObj.name, closable: true}));

        // now it's a tab, so we can do this:
        var thetab = this.getTabByJID(contactObj.jid);
        var textArea = getEl(tabId + "-text");

        this.tabs[contactObj.jid] = {
            type: "chat",
            tab: this.getTabByJID(contactObj.jid),
            contact: contactObj
        };

        var tabFocusAction = function(contact) {
            this.clearNotification(contact.jid);
            this.dialog.setTitle('<h1>' + contact.name + '</h1>');
            this._scrollMessageHistory(getEl("jive-tab-" + contact.jid + "-history"));
            textArea.dom.focus();
        }.bind(this, contactObj);
        thetab.addListener("activate", tabFocusAction);

        thetab.addListener("close", function() {
            this._wrappedFns[tabId].each(function(value) {
                value();
            });
            this.fireEvent("tabclosed", contactObj, this.tabs[contactObj.jid]);

            delete this._wrappedFns[tabId];
            delete this.tabs[contactObj.jid];
        }.bind(this));
        var clearNotifyListener = function(contact) {
            this.clearNotification(contact.jid);
        }.bind(this, contactObj);
        thetab.el.mon("click", clearNotifyListener);
        getEl(getEl(tabId + '-history').dom.parentNode.id).mon("click", clearNotifyListener);

        if (contactObj.addListener) {
            var listener = function(oldStatus, status) {
                thetab.textEl.replaceClass('jive-status-' + oldStatus, 'jive-status-' + status)
            };
            contactObj.addListener("status", listener);
            thetab.addListener("close", function() {
                contactObj.removeListener("statusChanged", listener);
            });
        }
        thetab.textEl.addClass('jive-status-' + (contactObj.status ?
                                                 contactObj.status : "unavailable"));
        this.dialog.endUpdate();
        tabFocusAction();
        return true;
    },

    preAddMUCChooser: function() {
        var tabId = "jive-tab-mucchooser";
        if (this.dialog.layout.regions['center'].panels.items[tabId + '-spinner']) {
            delete this.dialog.layout.regions['center'].panels.items[tabId + '-spinner'];
        }
        jive.spank.chat.Template.spinnertab.append(this.bodyId,
        {tabId: tabId, text: 'Loading...'});

        var layout = this.dialog.getLayout();
        this.dialog.beginUpdate();
        layout.add('center', new YAHOO.ext.ContentPanel(tabId + '-spinner',
        {title: 'Choose a Conference'}));
        this.dialog.endUpdate();

        var thetab = this.getTabs().items[tabId + '-spinner'];
        thetab.textEl.addClass('jive-muc');

        var self = this;
        thetab.addListener("close", function() {
            delete self.dialog.layout.regions['center'].panels.items[tabId + '-spinner'];
        });

        this.tabs['mucchooser'] = {
            type: "muc-spinner",
            tab: thetab
        };
    },

    addChooseMUCTab: function(roomsData) {
		if(window.jive_enable_grid == "enable") {
        this.dialog.beginUpdate();
        if (this.tabs['mucchooser']) {
            this.getTabs().removeTab('jive-tab-mucchooser-spinner');
            delete this.dialog.layout.regions['center'].panels.items['jive-tab-mucchooser-spinner'];
            delete this.tabs['mucchooser'];
        }

        var tabId = YAHOO.util.Dom.generateId();
        jive.spank.chat.Template.mucchooser.append(this.bodyId, {tabId: tabId});
        this._wrappedFns[tabId] = [];

        var layout = this.dialog.getLayout();
        var innerLayout = new YAHOO.ext.BorderLayout(tabId + "-layout",
                jive.spank.chat.ChatWindow.chooseMUCConfObject);

        innerLayout.add('north', new YAHOO.ext.ContentPanel(tabId + '-toppane'));
        jive.spank.chat.Template.muc_chooser_top.append(tabId + '-toppane', {tabId: tabId});

        // fire up those tophat buttons
        getEl(tabId + '-createconf').addListener('click', this.fireEvent.createDelegate(this,
                ['createmuc', this, tabId + "-layout"]));
        getEl(tabId + '-refresh').addListener('click', this.fireEvent.createDelegate(this,
                ['refreshmuclist', this, tabId]));

        // add gridpanel with our grid
        innerLayout.add('center',
                new YAHOO.ext.GridPanel(this._buildMUCChooserGrid(roomsData, tabId)));


		layout.add('center', new YAHOO.ext.NestedLayoutPanel(innerLayout,
        {title: "Choose a Conference", closable: true}));

        var realTabId = getEl(tabId + '-roomgrid').getParentByClass('yui-ext-tabitembody').id;
        var muctab = this.getTabs().items[realTabId];
        muctab.textEl.addClass('jive-muc');

        var tabFocusAction = this.dialog
                .setTitle.createDelegate(this.dialog, ["<h1>" + "Choose a Conference" + "</h1>"]);
        muctab.addListener("activate", tabFocusAction);
        muctab.addListener("close", this._wrappedFns[tabId].each.createDelegate(
                this._wrappedFns[tabId], [function(func) {
            func();
        } ]));

        this.tabs['muc-chooser-' + tabId] = {
            type: "muc-chooser",
            tab: muctab
        };
        this.dialog.endUpdate();
        getEl(tabId + '-confcontrols').fitToParent();
        tabFocusAction();
		}
    },

    _buildMUCChooserGrid: function(roomsData, tabId) {
		if(window.jive_enable_grid == "enable") {
        var schema = {
            fields: ["name", "muc#roominfo_subject", "muc#roominfo_occupants"]
        }
        var gridData = new YAHOO.ext.grid.SpankJSONDataModel(schema);
        var dataProcessor = function(value) {
            if (value.values) {
                return value.values[0];
            }
            else {
                return value;
            }
        }
        gridData.addPreprocessor(1, dataProcessor);
        gridData.addPreprocessor(2, dataProcessor);
        gridData.loadData(roomsData);

        // get some labels on there
        var roomCols = [
        {header: "Name", width: 240, sortable: true},
        {header: "Subject", width: 160, sortable: true},
        {header: "Occupants", width: 70, sortable: true}
                ];
        var gridCols = new YAHOO.ext.grid.DefaultColumnModel(roomCols);

        // finally! build grid
        var roomGrid = new YAHOO.ext.grid.Grid(tabId + '-roomgrid', {
            dataModel: gridData,
            colModel: gridCols,
            selModel: new YAHOO.ext.grid.SingleSelectionModel(),
            monitorWindowResize: false,
            stripeRows: false
        });
        roomGrid.render();
        this._wrappedFns[tabId].push(roomGrid.destroy.createDelegate(roomGrid, [true]));
        // add row dblclick handler
        roomGrid.addListener('rowdblclick', function(grid, rownum, evt) {
            var choosertabId = evt.findTarget('ylayout-nested-layout').id;
            var name = grid.getDataModel().getRow(rownum)[0]
            var jid = grid.getSelectedRowId();
            this.fireEvent("mucdblclicked", this, jid, name, choosertabId);
        }.bind(this));

        return roomGrid;
		}
    },

    preAddMUC: function(roomObj, choosertabId) {
        var jid = roomObj.jid;
        if(jid.toBareJID)
    		jid = jid.toBareJID();
        var tabId = "jive-tab-" + jid;        
        if (this.dialog.layout.regions['center'].panels.items['jive-tab-' + jid + '-spinner']) {
            delete this.dialog.layout.regions['center'].panels.items['jive-tab-' + jid + '-spinner'];
        }
        jive.spank.chat.Template.spinnertab.append(this.bodyId,
        {tabId: tabId, text: 'Joining "' + roomObj.name + '"...'});
        if (choosertabId) {
            this.getTabs().removeTab(choosertabId);
            // maybe best left to external method?
        }

        var layout = this.dialog.getLayout();
        this.dialog.beginUpdate();
        layout.add('center', new YAHOO.ext.ContentPanel(tabId + '-spinner',
        {title: roomObj.name}));
        this.dialog.endUpdate();

        var thetab = this.getTabs().items['jive-tab-' + jid + '-spinner'];
        thetab.textEl.addClass('jive-muc');

        var self = this;
        thetab.addListener("close", function() {
            delete self.dialog.layout.regions['center'].panels.items['jive-tab-' + jid + '-spinner'];
        });

        this.tabs[jid] = {
            type: "muc-spinner",
            tab: thetab
        };
    },
    removeMUCSpinner: function(jid) {
        if (this.tabs[jid] && this.tabs[jid].type == 'muc-spinner') {
            this.dialog.beginUpdate();
            delete this.dialog.layout.regions['center'].panels.items['jive-tab-' + jid + '-spinner'];
            this.getTabs().removeTab(this.tabs[jid].tab.id);
            delete this.tabs[jid];
            if (this.dialog.layout.regions['center'].tabs.items.length == 0) {
                this.dialog.hide();
            }
            else {
                this.dialog.endUpdate();
            }
        }
    },

/**
 * Adds a tab for a multi-user chat room.
 *
 * @param {Object} roomObj JSON with keys 'jid', 'name', and 'occupants' (the
 * latter being just like the JSON for a roster group)
 * @param {String} choosertabId optional DOM ID for a muc-chooser tab to kill
 * @param {RosterWindow} rosterWindow optional to show a list of possible invitees to the
 * conference room.
 */
    addMUC: function(roomObj, choosertabId, rosterWindow) {
    	var jid = roomObj.jid;
    	
    	if(jid.toBareJID)
    		jid = jid.toBareJID();   		

        var tabId = "jive-tab-" + jid;
        this.dialog.beginUpdate();
        if (this.tabs[jid] && this.tabs[jid].type == 'muc-spinner') {
            var tabid = this.tabs[jid].tab.id
            this.getTabs().removeTab(this.tabs[jid].tab.id);
        }

        jive.spank.chat.Template.muctab.append(this.bodyId, {tabId: tabId});
        
        var layout = this.dialog.getLayout();
		
		//main layout contains an east sidebar and a center everything else
		var mainLayout = new YAHOO.ext.BorderLayout(tabId + "-layout", jive.spank.chat.ChatWindow.mucConfObject);
		var innerLayout = new YAHOO.ext.BorderLayout(tabId + "-innerlayout", jive.spank.chat.ChatWindow.tabConfObject);
		var sidebarLayout = new YAHOO.ext.BorderLayout(tabId + "-sidebarlayout", jive.spank.chat.ChatWindow.mucSidebarConfObject);

		//innerLayout (center panel in mainLayout) contains a north topic, a center chat history, and a south chat text input
       	var topic = new YAHOO.ext.ContentPanel(tabId + '-subjectbar');
       	innerLayout.add('north', topic);
        
		var chatPanel = new YAHOO.ext.ContentPanel(tabId + '-history');
        innerLayout.add('center', chatPanel);

        //adds the text entry box to 'south'
        innerLayout = this._layoutTextarea(innerLayout, tabId, jid);
        
		
        //the other element in the sidebar is added in prepUserPane, unless there's a rosterWindow
        var contactList = new YAHOO.ext.ContentPanel(tabId + '-occupants');
        sidebarLayout.add('center', contactList);
		
		if (rosterWindow) {
            sidebarLayout = this._doMucControls(tabId, roomObj, rosterWindow.contactsForAutocomp.createDelegate(rosterWindow), sidebarLayout);
        }
        
        //put together the sidebar + main area
        var sidebar = new YAHOO.ext.NestedLayoutPanel(sidebarLayout);
		mainLayout.add('east', sidebar);
		
        var main = new YAHOO.ext.NestedLayoutPanel(innerLayout);
        mainLayout.add('center', main);
		
        layout.add('center', new YAHOO.ext.NestedLayoutPanel(mainLayout,
        {title: roomObj.name, closable: true}));
        
        topic.getEl().dom.parentNode.className += " jive-topic";
        
		chatPanel.getEl().dom.parentNode.className += " jive-chat";
        contactList.getEl().dom.parentNode.parentNode.className += " jive-contact-list";
        main.getEl().dom.parentNode.className += " jive-main";
        sidebar.getEl().dom.parentNode.className += " jive-sidebar";
        
        var eastSplit = layout.regions['east'].getSplitBar()
        this._wrappedFns[tabId].push(eastSplit.destroy.createDelegate(eastSplit, [true]));

        // now it's a tab, so we can do this:
        var thetab = this.getTabByJID(jid);
        var tabFocusAction = function(jid, name, textArea, messageHistory) {
            this.clearNotification(jid);
            this.dialog.setTitle("<h1>" + name + "</h1>");
            this._scrollMessageHistory(messageHistory);
            textArea.dom.parentNode.className += " jive-message-field"; //hax. Should only be set once.
            textArea.dom.focus();
        }.bind(this, jid, roomObj.name, getEl(tabId + "-text"), getEl(tabId + "-history"));

        thetab.addListener("activate", tabFocusAction);
        if (!this.dialog.getLayout().regions['south']) {
            thetab.addListener("close", function() {
                this._wrappedFns[tabId].each(function(value) {
                    value();
                });
                this.fireEvent("tabclosed", roomObj, this.tabs[jid]);

                var roomEl = getEl(jid + '-');
                if (roomEl) {
                    roomEl.remove();
                }

                delete this._wrappedFns[tabId];
                delete this.tabs[jid];
                thetab.purgeListeners();
            }.bind(this));
            thetab.textEl.addClass('jive-muc');
        }
        else {
            jive.spank.chat.Template.muc_subject.append(tabId + '-subjectbar', {jid: jid});
            this.tabId = tabId;
            this.dialog.getLayout().regions['center'].panels.items[0].id = tabId;
        }

        var clearNotifyListener = this.clearNotification.createDelegate(this, [jid]);
        thetab.el.addListener("click", clearNotifyListener);
        getEl(getEl(tabId + '-history').dom.parentNode.id).addListener("click",
                clearNotifyListener);

        // fill in room participants
        jive.spank.chat.Template.roster.append(tabId + '-occupants', {
            rosterId: tabId + '-roster',
            groups: ''
        });
        thetab.roster = new jive.spank.roster.Roster(tabId + '-roster');

        var participants = {"Participants": (roomObj.occupants ? roomObj.occupants : {})};
        thetab.roster.setRoster(participants);
        thetab.roster.render();
        thetab.roster.sortGroups();
        thetab.roster._enableBehaviors(false);
        // false = no group hiding
        getEl(tabId + "-text").dom.focus();

        this.dialog.endUpdate();
        tabFocusAction();
        return this.tabs[jid] = {
            type: "muc-room",
            tab: thetab,
            roster: thetab.roster,
            participants: thetab.roster.groups["Participants"],
            room: roomObj
        };
    },

    _layoutTextarea: function(innerLayout, tabId, tabJID) {
        innerLayout.add('south', new YAHOO.ext.ContentPanel(tabId + '-text'));
        var textArea = getEl(tabId + "-text");

        this._wrappedFns[tabId] = [];

        var southSplit = innerLayout.regions['south'].getSplitBar()
        this._wrappedFns[tabId].push(southSplit.destroy.createDelegate(southSplit, [true]));

        var resizeHandler = textArea.fitToParent.createDelegate(textArea);
        innerLayout.delayedListener("regionresized", resizeHandler, 100);
        this._wrappedFns[tabId].push(innerLayout.purgeListeners.createDelegate(innerLayout));

        this.dialog.addListener("resize", resizeHandler);

        this._wrappedFns[tabId].push(this.dialog.removeListener.createDelegate(this.dialog,
                ["resize", resizeHandler]));

        //XXX: this is a hack to get around the fact that it's too early. We should figure out where it really goes.
        //Without it, the text entry box is too large until you resize the window.
        window.setTimeout(resizeHandler, 1000);

        // adding a message handler to textarea
        var wrapper = textArea.mon('keypress', this._handleTextAreaInput.bind(this, tabJID));
        this._wrappedFns[tabId].push(YAHOO.ext.EventManager.removeListener.createDelegate(
                YAHOO.ext.EventManager, ["keypress", textArea, wrapper]));

        wrapper = textArea.mon('focus', this._handleTextAreaFocus.bind(this, tabJID));
        this._wrappedFns[tabId].push(YAHOO.ext.EventManager.removeListener.createDelegate(
                YAHOO.ext.EventManager, ["focus", textArea, wrapper]));

        wrapper = textArea.mon('blur', function() {
            jive.spank.chat.ChatWindow.focusedJID = '';
        });

        this._wrappedFns[tabId].push(YAHOO.ext.EventManager.removeListener.createDelegate(
                YAHOO.ext.EventManager, ["blur", textArea, wrapper]));

        return innerLayout;
    },
    _handleTextAreaFocus: function(focusedTextAreaJID, evt) {
        this.clearNotification(focusedTextAreaJID);
        jive.spank.chat.ChatWindow.focusedJID = focusedTextAreaJID;
    },
    _handleTextAreaInput: function(tabJID, evt) {
        var textArea = evt.getTarget();
        var input = false;
        var message = textArea.value;

        if (evt.getKey() == 13) {
            if (!evt.ctrlKey && !evt.shiftKey && message != "") {
                this.fireEvent("message", tabJID, message);
                window.setTimeout(function() {
                    this.value = "";
                }.bind(textArea), 10);
            }

            if (!evt.ctrlKey && !evt.shiftKey) {
                evt.preventDefault();
            }
            else {
                input = true;
            }
        }
        else {
            if (evt.getKey() == 9) {
                //tab completion of nicks.
                this.completeNick(tabJID, message, textArea);
                evt.preventDefault();
            }
            input = true;
        }

        if(input) {
            this.fireEvent("input", tabJID);
        }
    },

    _doMucControls: function(tabId, room, contactListFunction, layout) {
        jive.spank.chat.Template.muc_controls.append(tabId + '-sidebarheader',
        {jid: room.jid});
        jive.spank.chat.Template.mucinvitemenu.append(document.body,
        {jid: room.jid});
		
		layout.add('north', new YAHOO.ext.ContentPanel(tabId + '-sidebarheader'));

        var mucInviteContainer = getEl(room.jid + '-container');
        mucInviteContainer.hide();
        this._wrappedFns[tabId].push(mucInviteContainer.remove.createDelegate(mucInviteContainer));

        var mucAutoComp = new jive.spank.AutoComplete(room.jid + '-autocomp',
                room.jid + '-autocomp-menu',
                new YAHOO.widget.DS_JSFunction(contactListFunction),
        {typeAhead: true, autoHighlight: true, minQueryLength: 0, maxResultsDisplayed: 20}
                );
        mucAutoComp.formatResult = function(oResultItem, sQuery) {
            return "<div class='roster-contact-" + oResultItem[2] + "'>" + oResultItem[0] + "</div>";
        };

        var jid = room.jid;
        var self = this;
        mucAutoComp.itemSelectEvent.subscribe(function(type, args) {
            self.fireEvent('mucinvitation', self, args[2][1].toString(), jid);
            getEl(jid + '-autocomp').dom.blur();
        });

        var inviteControl = getEl(jid + '-control');
		var menuEl = getEl(room.jid + '-autocomp-menu')
        inviteControl.mon('click', function(chatWindow, inviteContainerElement, mucAutoComplete, contactListFunction, menuEl) {
            chatWindow.invitee = '';

            var entry = inviteContainerElement.getChildrenByTagName('input')[0];
            entry.dom.value = '';
            inviteContainerElement.alignTo(this, 'bl');
			menuEl.setWidth(192);
            entry.setWidth(192);
            inviteContainerElement.show();
            inviteContainerElement.setStyle('z-index', self.dialog.lastZIndex + 1);
            entry.dom.focus();

            mucAutoComp._populateList('', contactListFunction(), mucAutoComp);

            inviteContainerElement.repaint();
        }.createDelegate(inviteControl, [this, getEl(room.jid + '-container'), mucAutoComp,
                contactListFunction, menuEl]));
        // realign menu when window moves? when pane resizes?

        var autoComplete = getEl(jid + '-autocomp');
        autoComplete.mon('keypress', function(autoComplete, jid, contactListFunction,
                                              evt) {
            if (evt.getKey() == 13) {
                evt.preventDefault();
                var contact = contactListFunction().detect(function(text, value) {
                    return text == value[0];
                }.bind(this, autoComplete.dom.value));

                if (!contact) {
                    contact = autoComplete.dom.value;
                }
                else {
                    contact = contact[1].toString();
                }
                this.fireEvent('mucinvitation', this, contact, jid);
                window.setTimeout("getEl('" + jid + "-container').hide();", 200);
                getEl('jive-tab-' + jid + '-text').dom.focus();
            }
        }.bind(this, autoComplete, jid, contactListFunction));
        autoComplete.addListener('blur', function(jid) {
            window.setTimeout("getEl('" + jid + "-container').hide();", 200);
            getEl('jive-tab-' + jid + '-text').dom.focus();
        }.bind(this, jid));

        // aaaaand briefly by comparison, the change-nick button
        getEl(jid + '-changenick').addListener('click', function() {
            var confObj = self.dialog.getLayout().getRegion('south') ?
                          {x: self.dialog.el.getX() + 125, y: self.dialog.el.getY() + 140}
                    : null;
            self.showChangeNick(room, confObj);
        });
		return layout;
    },

	showChangeNick: function(roomObj, confObj) {
        var self = this;
        confObj = $H(confObj).merge({
            title: "Change Nickname",
            width: 285, height: 105,
            templateKeys: {nick: ''}
        });
        var renamer = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.rename,
                confObj
                );
        renamer.dialog.show();
        var doChange = function(jid, dialog) {
            this.fireEvent("changenameinmuc", this, jid, $F(dialog.id + '-name'));
            dialog.dialog.hide();
        }.bind(this, roomObj.jid.toString(), renamer);
        getEl(renamer.id + '-name').mon("keypress",
                doChange.createInterceptor(function(evt) {
                    return evt.getKey() == 13;
                }));
        getEl(renamer.id + '-rename').addListener("click", doChange);
        getEl(renamer.id + '-name').dom.focus();
    },

    showMUCPassword: function(roomObj, confObj, passwordCallback) {
        confObj = $H(confObj).merge({
            title: "Enter the password for '" + roomObj.name + "'",
            width: 285, height: 105
        });
        var keymasta = new jive.spank.chat.Dialog(this,
                jive.spank.chat.Template.mucpassword,
                confObj
                );
        keymasta.dialog.show();

        var self = this;
        var called = false;
        var doSecret = function() {
            var password = $F(keymasta.id + '-passwd');
            passwordCallback(password);
            called = true;
            keymasta.dialog.hide();
        };
        keymasta.dialog.addListener('hide', function() {
            if (!called) {
                passwordCallback(null);
            }
        });
        getEl(keymasta.id + '-passwd').mon("keypress",
                doSecret.createInterceptor(function(evt) {
                    return evt.getKey() == 13;
                }));
        getEl(keymasta.id + '-sendsecret').addListener("click", doSecret);
        getEl(keymasta.id + '-passwd').dom.focus();
    },

/**
 * Final bit of the message chain: adds HTML, sorts out time, and scrolls it
 * into view.
 *
 * @param {String} jid valid jid that links the message to tab in this window.
 * @param {String} from contact name to display.
 * @param {Object/HTMLElement} msgObj a conf obj with body, isLocal (bool) and time, or a prepared DOM element
 * @param {Function} callback optional func to call once we've drawn the DOM element
 */
    addMessage: function(jid, from, msgObj, callback) {
    	this.completionState = {index : 0, completed : null, original : null}; //clear tab complete

        var msgframe = getEl("jive-tab-" + jid + "-history");

		from = from.toLowerCase();

        if (msgObj.body) {
            var timecls = '';
            if (msgObj.time) {
                timecls = 'offline';
            }
            else {
                var dateobj = new Date();
                msgObj.time = dateobj.toLocaleTimeString();
            }
            var type = (msgObj.isLocal ? "user" : "contact");

            var mentioned = (msgObj.mentioned ? "mentioned" : "");

			var consecutive = ((this.previousMessageInfo != null && from == this.previousMessageInfo.from && jid == this.previousMessageInfo.jid && type == this.previousMessageInfo.type) ? "consecutive" : "");
 			this.previousMessageInfo = {jid:(jid.toBareJID != null ? jid.toBareJID() : jid), from:from, msg:msgObj, time: msgObj.time , type: type};

			if(msgObj.body.indexOf("/me") == 0) {
				msgObj.action = "action";
				msgObj.body = " * " + from + msgObj.body.replace("/me", "");
			}
			var body = jive.spank.chat.Filter.applyAll(msgObj.body);
            var newElm = jive.spank.chat.Template.message.append(msgframe.id,
            {from: from, message: body, type: type, mentioned: mentioned, consecutive: consecutive, action: msgObj.action, time: msgObj.time, msgclass: timecls, color: uniqueColorForString(from)});
        }
        else {
            msgframe.dom.appendChild(msgObj.el);
            msgObj.callback(this);
        }

        this._scrollMessageHistory(msgframe);

        var testjid = jive.spank.chat.ChatWindow.focusedJID;
        if (testjid != jid) {
            this.addNotification(jid);
        }
    },
    addStatusMessage: function(jid, message, customClass) {
    	delete this.previousMessageInfo;
        var msgframe = getEl("jive-tab-" + jid + "-history");

        var newElm = jive.spank.chat.Template.statusMessage.append(msgframe.id, {message: message, customClass: customClass});

        this._scrollMessageHistory(msgframe);
    },

    _scrollMessageHistory: function(histElm) {
    	var historyBox = histElm.dom.parentNode;
    	var historyHeight = histElm.getHeight();
    	var historyBoxHeight = historyBox.clientHeight;
    	if( historyHeight - (historyBox.scrollTop + historyBoxHeight) < 100 || historyHeight < historyBoxHeight ) {
			historyBox.scrollTop = historyHeight - historyBoxHeight;
        }
    },
/**
 * Notifies the user that the tab needs their attention.
 */
    addNotification: function(jid) {
        var thistab = this.getTabByJID(jid);

        if (typeof this.newMessages[jid] == 'undefined') {
            this.newMessages[jid] = 1;
        }
        else {
            this.newMessages[jid]++;
        }

		if(thistab && thistab.textEl)
			thistab.textEl.addClass('jive-notify');

        // make sure there is an interval for this window
        if (this.notificationInterval && !this.notificationInterval[jid]) {
            var bodyId = this.bodyId;
            this.notificationInterval = window.setInterval(function() {
                getEls('#' + bodyId + ' span.jive-notify').toggleClass('flashNotify');
            }, 1000);
        }
        else {
            getEls('#' + this.bodyId + ' span.jive-notify').addClass('flashNotify');
        }
        // and the browser window too
        jive.spank.notifier.doTitleNotify();

		if(thistab && thistab.text) {
			if (/ \(\d+\)$/.test(thistab.text)) {
				thistab.setText(thistab.text.replace(/ \(\d+\)$/, ''));
			}
			thistab.setText(thistab.text + " (" + this.newMessages[jid] + ")");
		}
    },

    completionState : {
        index : 0,
        completed : null,
        original : null
    },

    completeNick : function (jid, messageBody, textArea) {
        var roster = this.getTabByJID(jid).roster;
        if(!roster) return;

        var occupants = roster.groups.Participants.contacts;
        var nick;
        var state = this.completionState;
        var loopCounter = 0; //we're treating the contact list as a circular buffer, so we want to break out of the loop as soon as we've been through the whole thing with no hits
        if(state.original == null || state.completed != messageBody)
            state.original = messageBody;
        for(var i = state.index; i < occupants.length && loopCounter < occupants.length; i++)
        {
            loopCounter++;
            state.index = i + 1;
            nick = occupants[i].name;
            if(state.index >= occupants.length) {
                state.index = 0;
                i = 0;
            }
            if(nick.indexOf(state.original) == 0 && state.original.length < nick.length)
            {
                state.completed = nick + ": ";
                textArea.dom.value = state.completed;
                textArea.dom.selectionStart = textArea.dom.value.length;
                textArea.dom.selectionEnd = textArea.dom.value.length;
                return;
            }
        }
    },

/**
 * Clears any notifications currently operating on the tab for a particular JID
 *
 * @param {String} jid the jid to clear the notifications for.
 */
    clearNotification: function(jid) {
        var thetab = this.getTabByJID(jid);
        if (thetab && thetab.textEl) {
            thetab.textEl.removeClass('jive-notify').removeClass('flashNotify');
            thetab.setText(thetab.text.replace(/ \(\d+\)$/, ''));
        }
        delete this.newMessages[jid];
        if (this.notificationInterval && this.notificationInterval[jid]
                && this.newMessages.properties && this.newMessages.properties.length == 0) {
            window.clearInterval(this.notificationInterval[jid]);
            this.notificationInterval[jid] = null;
        }
        jive.spank.notifier.doTitleNotify();
    },
/**
 * Clears all notifications operating on this window.
 */
    clearAllNotifications: function() {
        var blinkers = getEls('#' + this.bodyId + ' span.jive-notify');
        blinkers.removeClass('jive-notify');
        // doesn't fix tab texts on the assumption that we call this when we close
        window.clearInterval(this.notificationInterval);
        this.notificationInterval = null;
        blinkers.removeClass('flashNotify');
        this.newMessages = {};
        jive.spank.notifier.doTitleNotify();
    },
    getActiveTabElement: function() {
        var thetab = this.getTabs() ? this.getTabs().active : this._tabIfSingleTab();
        return getEl(thetab.id);
    },
/**
 * Returns all of the tabs of this chat window.
 */
    getTabs: function() {
        var regions = this.dialog.getLayout().regions;
        return regions["center"].getTabs();
    },

/**
 * Takes a JID and returns the tab for the jid.
 *
 * @param {String} jid the jid for which to return the tab
 */
    getTabByJID: function(jid) {
        var guys = this.getTabs();
        if (guys != null) {
            var tabb = guys.items['jive-tab-' + jid + '-layout'];
			if(!tabb) {
                tabb = guys.items['jive-tab-' + jid + '-spinner']
            }
            return (typeof tabb == 'undefined') ? null : tabb;
        }
        else {
            return this._tabIfSingleTab();
        }
    },

    _tabIfSingleTab: function() {
        return this.dialog.getLayout().regions["center"].panels.items[0];
    },

/**
 * Removes all of the tabs from this window.
 */
    removeAllTabs: function() {
        //return;
        var tabs = this.getTabs();
        if (!tabs) {
            return;
        }
        for (var i = tabs.getCount() - 1; i >= 0; i--) {
            tabs.getTab(i).closeClick();
        }
        delete this.tabs;
        this.tabs = {};
    },

    destroy: function() {
        this.clearAllNotifications();
        jive.spank.chat.ChatWindow.superclass.destroy.call(this);
        delete this.tabs;
    },

    hide: function() {
        this.clearAllNotifications();

        jive.spank.chat.ChatWindow.superclass.hide.call(this);
    },

/**
 * Creates tab in this window for the specified contact or JID.
 *
 * @param {jive.spank.chat.Contact/String} either a Contact object (or fakey
 * version with name and jid properties) or a jid.
 */
    getContactTab: function(contactObj, focus) {
        if (typeof contactObj == 'string') {
            // we were just passed a jid, compensate
            var jid = contactObj;
            contactObj = {name: jid, jid: jid};
        }

        var thetabs = this.getTabs();
        var convo;
        if (thetabs) {
            convo = thetabs.getTab("jive-tab-" + contactObj.jid + "-layout");
        }
        if (typeof convo == 'undefined') {
            this.addTab(contactObj);
        }
        if (focus) {
            this.focusContactTab(contactObj);
        }
    },

    focusContactTab: function (contactObj) {
        var thetabs = this.getTabs();
        thetabs.activate("jive-tab-" + contactObj.jid + "-layout");
        var textArea = getEl("jive-tab-" + contactObj.jid + "-text");
        textArea.dom.focus();
    },

    prepUserPane: function() {
        // assumes presence of an east pane on the main dialog's layout, which in turn contains at least one pane! beware
        
        if(window.showUpperStuff == "show") {
		var layout = this.dialog.getLayout().getRegion("east").getPanel(0).getLayout();
		jive.spank.chat.Template.userpane.append(this.bodyId + '-toppane', {id: this.bodyId});
		this.dialog.beginUpdate();
		var header = new YAHOO.ext.ContentPanel(this.bodyId + '-toppane');
		layout.add('north', header);
		header.getEl().dom.parentNode.className += " jive-user-controls";
		this.dialog.endUpdate();
        }
    },

	//mucManager is optional
    finalizeUserPane: function(uname, mucManager) {
    
            if(window.showUpperStuff == "show") {

		jive.spank.chat.Template.userpane_loggedin.append(this.bodyId + '-message', {id: this.bodyId, uname: uname, presence: "available"});

			//this lets us style the username field based on whether the user has clicked on it to edit.
			var input = getEl(this.bodyId + '-uname');
			var editButton = getEl(this.bodyId + '-uname-edit');

			var change = function(evt) {
		if( evt == undefined || evt.keyCode == 13 ) {
			var jidFromId = this.tabId.split("-")[2];
					var nameEl = getEl(this.bodyId + '-uname');
					nameEl.replaceClass("jive-muc-username-active", "jive-muc-username");
			this.fireEvent("changenameinmuc", this, this.tabs[jidFromId].room.jid, nameEl.dom.value);
			this.getActiveTabElement().dom.focus();
			getEl(this.bodyId + '-uname-edit').dom.innerHTML = "change";
			if(evt != undefined)
						evt.preventDefault();
            	}
        }.bind(this);
		
		var toggleEditing = function () {
			if(this.dom.className.indexOf("jive-muc-username-active") > -1) {
				change();
			} else {
				this.replaceClass("jive-muc-username", "jive-muc-username-active");
				this.dom.focus();
			}
		}.bind(input);
		
		editButton.on('click', function() {this.dom.innerHTML = (this.dom.innerHTML == "change" ? "ok" : "change"); toggleEditing(); }.bind(editButton));
		input.on('keydown', change);
		
		var update = function(window, roomJID, newName) {
			this.dom.value = newName;
		}.bind(input);
		this.addListener("changenameinmuc", update);
		
		var tt = new YAHOO.widget.Tooltip("nick-edit-tooltip", {
											context: editButton.dom,
											showDelay: 500,
											zIndex: 15000 });
											
		tt.setHeader(""); 
		tt.setBody("<p>Click here to change your nickname</p>"); 
		tt.setFooter(""); 
		
		if(mucManager) {
			//Presence change control
			var presenceControl = getEl(this.bodyId + '-presencecontrol');
			var toggleAvailable = function() {
				var newPres = presenceControl.hasClass("available") ? "away" : "available";
				var oldPres = newPres == "available" ? "away" : "available";
				presenceControl.replaceClass(oldPres, newPres);
				presenceControl.dom.innerHTML = newPres;
				var jidFromId = this.tabId.split("-")[2];
				var pres = new XMPP.Presence();
				pres.setMode(newPres);
				pres.setTo(new XMPP.JID(jidFromId + "/" + getEl(this.bodyId + '-uname').dom.value));
				mucManager.getRoom(jidFromId).presenceManager.sendPresence(pres);
			}.bind(this);
						
			presenceControl.on('click', toggleAvailable);
			var tt1 = new YAHOO.widget.Tooltip("presence-control-tooltip", {
												context: presenceControl.dom,
												showDelay: 500,
												zIndex: 15000 });
			tt1.setHeader(""); 
			tt1.setBody("<p>Click here to change your status</p>"); 
			tt1.setFooter(""); 
		}
		}
    },

/**
 * Sets the subject line on MUC tabs. JID is optional in embedded-group-chat situations.
 *
 * @param {String} subject the subject line to display
 * @param {String} roomJid optional JID for the MUC tab in question
 */
    setSubject: function(subject, roomJid) {
        var subjElm = getEl((this.tabId ? this.tabId : "jive-tab-" + roomJid) + '-subject');
        if (subjElm && subjElm.dom) {
            subjElm.dom.innerHTML = subject;
        }
    }

});

jive.spank.chat.ChatWindow.getWindow = function(windowId) {
    return jive.spank.chat.ChatWindow.currentWindow[windowId];
}

jive.spank.chat.ChatWindow.createWindow = function() {
    var component = spank.loadComponent("chat");
    jive.spank.chat.ChatWindow.currentWindow[component.id] = component;
    component.dialog.addListener("hide", function() {
        delete jive.spank.chat.ChatWindow.currentWindow[component.id];
    });
    return component;
}

jive.spank.chat.ChatWindow.destroyWindow = function(windowId) 
{
    if (jive.spank.chat.ChatWindow.currentWindow[windowId]) {
        jive.spank.chat.ChatWindow.currentWindow[windowId].hide();
        delete jive.spank.chat.ChatWindow.currentWindow[windowId];
    }
}

jive.spank.chat.ChatWindow.tabConfObject = {
    north: {
        initialSize: 65
    },
    south: {
        split: true,
        initialSize: 50,
        minSize: 50,
        maxSize: 200,
        autoScroll: false,
        collapsible: true
    },
    center: {
        autoScroll: true
    }
};
jive.spank.chat.ChatWindow.chooseMUCConfObject = {
    north: {
        initialSize: 50
    },
    center: {
        autoScroll: false
    }
};

jive.spank.chat.ChatWindow.mucSidebarConfObject = {
    center: {
        autoScroll: false,
        collapsible: false
    },
	north: {
		initialSize: 42
	}
};

jive.spank.chat.ChatWindow.mucConfObject = {
    center: {
        autoScroll: false,
        collapsible: false
    },
	east: {
		initialSize: 145,
		split: true,
        autoScroll: false,
        collapsible: true
	}
};

jive.spank.chat.ChatWindow.currentWindow = {};
jive.spank.chat.ChatWindow.focusedJID = '';


jive.spank.roster = {};

jive.spank.roster.RosterWindow = function(id, attributes) {
    var width = attributes["width"] ? attributes["width"] : 210;
    var height = attributes["height"] ?
                 attributes["height"] :
                 YAHOO.util.Dom.getViewportHeight() - 65;
    //var x = attributes["x"] ? attributes["x"] : YAHOO.util.Dom.getViewportWidth() - 230;
    var x = attributes["x"] ? attributes["x"] : 0;
    var y = attributes["y"] ? attributes["y"] : 60;
    var resizable = attributes["resizable"] != "false";
    var draggable = attributes["draggable"] != "false";
    var closable = attributes["closable"] != "false";

    this.roster = null;
    // set in setRoster
    this.groups = null;
    // ditto

    this.controls = {};
    this.controlCount = 0;

    var conf = {
        modal: false,
        width: width,
        height: height,
        resizable: false,
        draggable: false,
        proxyDrag: false,
        shadow: false,
        minWidth: 200,
        minHeight: 150,
        x: x,
        y: y,
        closable: true,
        shim: false,
        north: {
            initialSize: 52,
            autoScroll: false
        },
        center: {
            closeOnTab: true,
            alwaysShowTabs: false,
            autoTabs: true
        }
    };
    this.events = {
    /**
     * @event changestatus
     * User picks a status from the menu or from the Set Status Msg dialog.
     * @param {jive.spank.roster.Roster} roster this roster window
     * @param {String} mode string representing the mode: 'chat', 'available', 'away', 'dnd'
     * @param {String} status optional status message
     */
        'changestatus': true,
    /**
     * @event setstatusmsgrequest
     * Request for the Set Status Msg dialog.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     */
        'setstatusmsgrequest': true,
    /**
     * @event addcontact
     * Hey, the user would like to add somebody.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {String} jid supposedly a valid JID!
     * @param {String} name the name by which the user wishes to remember this JID
     * @param {String} group the (uncleaned, unmolested) name of a group to add to
     */
        'addcontact': true,
    /**
     * @event acceptsubscription
     * User has decided to let someone add them.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {Boolean} addReciprocal true if we should add them as well
     * @param {String} jid JID of the subscriber
     * @param {String} nickname the nickname by which to add the subscriber
     * @param {String} group the (uncleaned, unmolested) name of the group to add to
     */
        'acceptsubscription': true,
        'denysubscription': true,
    /**
     * @event renamecontact
     * Hey, the user would like to rename somebody.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {jive.spank.roster.Contact} contact a contact object
     * @param {String} name the new name to change to
     */
        'renamecontact': true,
    /**
     * @event renamegroup
     * Hey, the user would like to rename an entire group.
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {jive.spank.roster.RosterGroup} group a group object
     * @param {String} name the new name to change to
     */
        'renamegroup': true,
    /**
     * @event removecontact
     * Remove this contact from the roster pls
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {jive.spank.roster.Contact} contact a contact object
     */
        'removecontact': true,
    /**
     * @event removegroup
     * Remove this group and ALL of its contacts
     * @param {jive.spank.roster.RosterWindow} roster this roster window
     * @param {jive.spank.roster.RosterGroup} group a group object
     */
        'removegroup': true,
        'close': true
    };
    jive.spank.roster.RosterWindow.superclass.constructor.call(this, id, "SparkWebChat", conf);

    var layout = this.dialog.getLayout();
    this.dialog.beginUpdate();
    layout.add('north', new YAHOO.ext.ContentPanel(this.bodyId + '-toppane'));
    this.dialog.endUpdate();

    this.dialog.close.removeAllListeners();
/*    
    this.dialog.close.addListener('click', function() {
        if (confirm("Are you sure you want to close the connection?\n('OK' to logout, 'Cancel' to stay connected.)")) {
            this.dialog.hide();
            this.fireEvent('close', this);
        }
    }.bind(this));
*/    
    
};

YAHOO.extend(jive.spank.roster.RosterWindow, jive.spank.Window, {
    needsUpdate: false,
    addTab: function(title) {
        var tabId = YAHOO.util.Dom.generateId();
        jive.spank.chat.Template.rostertab.append(this.bodyId, {tabId: tabId});
        var layout = this.dialog.getLayout();

        this.dialog.beginUpdate();

        var innerLayout = new YAHOO.ext.BorderLayout(tabId + "-layout", {
            north: {
                split: false,
                initialSize: 31,
                autoScroll: false
            },
            center: {
                autoScroll: true
            }
        });

        innerLayout.add('center', new YAHOO.ext.ContentPanel(tabId + '-resources'));
        jive.spank.chat.Template.roster.append(tabId + '-resources',
        {rosterId: 'jive-roster', groups: ''});
        innerLayout.add('north', new YAHOO.ext.ContentPanel(tabId + '-user'));
        jive.spank.chat.Template.control_panel.append(tabId + '-user',
        {tabId: tabId});

        this.controlPanel = innerLayout.regions['north'];
        this.controlPanel.hide();

        layout.add('center', new YAHOO.ext.NestedLayoutPanel(innerLayout, {title: title}));
        this.dialog.endUpdate();

        this.tabs[title] = tabId;
    },

    _prepUserStatusPanel: function(username, userStatus) {
        var elm = getEl(this.bodyId + '-toppane');
        jive.spank.chat.Template.status_panel.append(elm.id, {
            bodyId: this.bodyId,
            username: username,
            status: userStatus,
            statusName: userStatus.toLowerCase()
        });

        var statusControl = getEl(this.bodyId + '-statusmenu-ctrl');
        statusControl.addListener('click', function(statusControl, e) {
            var statMenu;
            if(!this.statusMenu) {
                this.statusMenu = this._createStatusMenu();
            }
            statMenu = this.statusMenu;
            getEl(statMenu.element).alignTo(statusControl, 'bl');
            statMenu.element.style.zIndex = this.dialog.lastZIndex + 1;
            statMenu.show();
            Event.stop(e);
        }.bind(this, statusControl));

        // dragging windows doesn't hide the menu! let's fix that
        var hideStatus = function() {
            if (this.statusMenu) {
                this.statusMenu.hide();
            }
        }.bind(this);
        this.dialog.header.addListener('click', hideStatus);
        for (var chawin in jive.spank.chat.ChatWindow.currentWindow) {
            jive.spank.chat.ChatWindow.currentWindow[chawin].dialog.header
                    .addListener('click', hideStatus);
            // will only work on windows open at the time... hmm
            // i'll live with that
        }
    },
    _createStatusMenu: function() {
        var statusMenu = new YAHOO.widget.Menu("jive-statusmenu");
        statusMenu.addItems([
                [
                {text: "Free to Chat"},
                {text: "Available"},
                {text: "On The Road"},
                {text: "Away"},
                {text: "On Phone"},
                {text: "Do Not Disturb"}
                        ]
                ]);
        statusMenu.render(document.body);

        var self = this;
        var fireChangeStatus = function(eventType, eventArr, statusStr) {
            this.fireEvent("changestatus", this, statusStr);
        };

        var menuItem;
        var statii = ['chat','available','onroad','away','onphone','dnd'];
        for (var i = 0; i < statii.length; i++) {
            menuItem = statusMenu.getItem(i);
            menuItem.element.className += ' roster-contact-' + statii[i];
            menuItem.clickEvent.subscribe(fireChangeStatus, statii[i], this);
        }
        return statusMenu;
    },

    setUserInfo: function(user, userMode) {
        // looking for the keys 'name' and either 'status' or 'mode'.
        // that's if user is an obj.
        var userName;
        if (arguments.length > 1) {
            userName = user;
        }
        else {
            userName = user.name;
            userMode = (user.status ? user.status : user.mode);
        }
        this.dialog.setTitle("<h1>My Contacts</h1>");
        this._prepUserStatusPanel(userName, userMode);
    },

    addGroup: function(groupName, groupObj) {
        this.roster.addGroup(groupName, groupObj);
    },

    addControl: function(ctrlTitle, confObj) {
        // this method continues to assume one rosterwindow tab named 'Contacts'

        // make control obj
        this.controls[ctrlTitle] = jive.spank.chat.Control.add(
                this.tabs['Contacts'] + '-controls',
                ctrlTitle,
                confObj
                );

        this.controlCount++;

        if (!this.controlPanel.isVisible()) {
            this.controlPanel.show();
        }

        return this.controls[ctrlTitle];
    },

    removeControl: function(ctrlTitle) {
        if (this.controls[ctrlTitle]) {
            this.controls[ctrlTitle].remove();
            delete this.controls[ctrlTitle];
        }
        this.controlCount--;
    },

    setRoster: function(rosterObj) {
        if (rosterObj == null) {
            rosterObj = this.fakeRosterStruct;
        }

        this.roster = new jive.spank.roster.Roster('jive-roster', true);
        this.groups = this.roster.groups;

        this.roster.setRoster(rosterObj);
        this.render();

        this.roster.addListener('offlinemoved', function() {
            if (!this.isUpdating) {
                this.render(true);
            }
            else {
                this.needsUpdate = true;
            }
        }, this, 1);
    },

/**
 * Returns contact obj for the currently selected contact.
 */
    getSelectedUser: function() {
        return this.roster.getSelectedUser();
    },

/**
 * Less elegant but more flexible way of finding contact objects: feed it the LI's ID.
 */
    getContactFromID: function(idStr) {
        var parts = idStr.split('-');
        var cJid = parts.slice(2, parts.length - 1).join('');
        // in case of jids with dashes
        return jive.spank.roster.Contact.find(this, cJid, parts[parts.length - 1]);
    },

/**
 * Draws HTML once the groups property is populated. Rewrites roster HTML entirely.
 */
    render: function(forceNow) {
        var tabId = this.tabs["Contacts"];

        this.roster.render();
        this.needsUpdate = false;

        // now that they exist:
        this.dialog.addListener("show", this.finishDisplay, this, true);
        if (forceNow) {
            this.finishDisplay();
        }
    },

    finishDisplay: function() {
        this.roster.sortGroups();
        this.roster._enableOfflineBehaviors();
        this.roster._enableBehaviors();
    },

    addContact: function(contact, groupName, group) {
        this.roster.addContact(contact, groupName, group);
        this.render(true);
    },

/**
 * Deletes all traces of specified contact
 */
    removeContact: function(jid) {
        this.roster.removeContact(jid);
    },

    changeUserStatus: function(newMode, newStatus) {
        var menu = getEl(this.bodyId + '-statusmenu-ctrl');
        var fullModeStrs = {
            chat: "Free to Chat",
            available: "Available",
            onroad: "On Road",
            away: "Away",
            onphone: "On Phone",
            dnd: "Do Not Disturb"
        };

        menu.dom.className = menu.dom.className.replace(
                /roster-contact-([^ ]*)/, 'roster-contact-' + newMode);
        menu.getChildrenByTagName('span')[0].dom.innerHTML = (
                newStatus != null ? newStatus : fullModeStrs[newMode]);
    },

    changeContactStatus: function(jid, newMode, newStatus) {
        this.roster.changeContactStatus(jid, newMode, newStatus);
    },

    getContactStatus: function(jid) {
        return this.roster.getContactStatus(jid);
    },

    showAddGroup: function() {
        var self = this;
        var addg = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.add_group,
        {title: "Add Group", width: 280, height: 140, yOffset: 125}
                );
        addg.dialog.show();

        // wire up the go button
        getEl(addg.id + '-creategroup').addListener('click', function() {
            // submit info
            self.fireEvent('addgroup', self, $F(addg.id + '-addgroupname'));
            addg.dialog.hide();
        });
    },

    showAddContact: function() {
        var self = this;
        var addc = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.add_contact,
        {title: "Add Contact", width: 280, height: 155}
                );
        addc.dialog.show();

        this._autocompGroups(addc, '-addcontact-group');

        $(addc.id + '-addusername').focus();

        // finally, wire up the buttons
        getEl(addc.id + '-createcontact').addListener('click', function() {
            // submit info
            self.fireEvent('addcontact', self,
                    $F(addc.id + '-addusername'),
                    $F(addc.id + '-addnickname'),
                    $F(addc.id + '-addcontact-group')
                    );
            addc.dialog.hide();
        });
    },

    showSubscriptionRequest: function(subscriberJid, subscriberNick) {
        var self = this;
        var subr = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.sub_request,
        {title: "Allow " + (subscriberNick != '' ? subscriberNick : subscriberJid) + " to add you?",
            width: 440, height: 220,
            templateKeys: {jid: subscriberJid, nick: subscriberNick} }
                );
        subr.dialog.show();

        this._autocompGroups(subr, '-subrequest-group');

        // wire up the actions
        getEl(subr.id + '-add').addListener('click', function() {
            // toggle style on labels
            getEls('#' + subr.id + ' label').toggleClass('disabled');
            getEl(subr.id + '-jid').toggleClass('disabled');
            // toggle enabled on fields
            getEl(subr.id + '-nick').dom.disabled = getEl(subr.id + '-subrequest-group').dom.disabled =
                                                    !getEl(subr.id + '-add').dom.checked;
        });
        getEl(subr.id + '-acceptsubrequest').addListener('click', function() {
            // submit info
            self.fireEvent('acceptsubscription', self,
                    $F(subr.id + '-add'),
                    subscriberJid,
                    $F(subr.id + '-nick'),
                    $F(subr.id + '-subrequest-group')
                    );
            subr.dialog.hide();
        });
        getEl(subr.id + '-denysubrequest').addListener('click', function() {
            // submit info
            self.fireEvent('denysubscription', self,
                    $F(subr.id + '-add'),
                    subscriberJid,
                    $F(subr.id + '-nick'),
                    $F(subr.id + '-subrequest-group')
                    );
            subr.dialog.hide();
        });
    },

    showRename: function(contactOrGrpObj) {
        if (contactOrGrpObj == null) {
            contactOrGrpObj = this.contactMenu.clickedContact;
        }

        var renamer = new jive.spank.chat.Dialog(self,
                jive.spank.chat.Template.rename,
        {title: "Renaming '" + contactOrGrpObj.name + "'",
            width: 250, height: 115,
            templateKeys: {nick: contactOrGrpObj.name} }
                );
        renamer.dialog.show();

        var self = this;
        var doRename = function() {
            var eventtofire = (typeof contactOrGrpObj.jid != 'undefined') ? 'renamecontact' : 'renamegroup';
            self.fireEvent(eventtofire, self, contactOrGrpObj, $F(renamer.id + '-name'));
            getEl(renamer.id + '-rename').removeAllListeners();
            renamer.dialog.hide();
        };
        getEl(renamer.id + '-name').mon("keypress",
                doRename.createInterceptor(function(evt) {
                    return evt.getKey() == 13;
                }));
        getEl(renamer.id + '-rename').addListener("click", doRename);
    },

    showRemove: function(contactObj) {
        // actually don't show anything
        this.fireEvent("removecontact", this, contactObj.jid.toString());
    },

    showGroupRename: function(grpGetterFunc) {
        var grpObj = grpGetterFunc();
        this.showRename(grpObj);
    },
    fetchClickedGroup: function() {
        // this is always the func passed into the above,
        // so we can get the clicked group in realtime rather than at bind time.
        return this.groupMenu.clickedGroup;
    },

    showGroupRemove: function(grpFunc) {
        var grpObj = grpFunc();
        // same deal as above
        var safety = new jive.spank.chat.Dialog(this,
                jive.spank.chat.Template.remove_group,
        {title: "Removing '" + grpObj.name + "'",
            width: 250, height: 100,
            templateKeys: {name: grpObj.name} }
                );
        safety.dialog.show();

        var self = this;
        var doRemove = function() {
            self.fireEvent("removegroup", self, grpObj);
            getEl(safety.id + '-remove').removeAllListeners();
            safety.dialog.hide();
        };
        getEl(safety.id + '-remove').addListener("click", doRemove);
    },

    _autocompGroups: function(dlog, fieldIdSuffix) {
        var fieldId = dlog.id + fieldIdSuffix;
        var conMenuId = fieldId + '-menu';
        var self = this;

        if (getEl(conMenuId) == null) {
            var conMenu = self.addMenuDiv(conMenuId);
            conMenu.className = "groups-ac";
        }

        var groupsFunc = function(query) {
            var justalist = [];
            for (var g in self.roster.groups) {
                justalist.push(g);
            }
            return self._prepareAutocompArray(justalist, query);
        };

        var grpAutoComp = new jive.spank.FlatAutoComplete(fieldId,
                conMenuId,
                new YAHOO.widget.DS_JSFunction(groupsFunc),
        {typeAhead: true, minQueryLength: 0}
                );
        grpAutoComp.formatResult = function(oResultItem, sQuery) {
            return oResultItem;
        };
        grpAutoComp.dataReturnEvent.subscribe(function(type, args) {
            if (args[2].length == 0) { // group results empty
                grpAutoComp.setBody("<div class='empty'>(No matches, will create new)</div>");
            }
            var thelm = getEl(conMenuId);
            thelm.alignTo(getEl(fieldId), 'bl');
            thelm.dom.style.zIndex = dlog.dialog.lastZIndex + 1;
            thelm.show();
        });

        getEl(fieldId).addListener('blur', function() {
            getEl(conMenuId).hide();
        });

        getEls('#' + conMenuId + ' li').mon('mousedown', function(evt) {
            getEl(fieldId).dom.value = evt.getTarget().innerHTML;
        });

        dlog.dialog.addListener('beforehide', function() {
            grpAutoComp.formatResult = Prototype.emptyFunction;
            groupsFunc = Prototype.emptyFunction;
            getEl(conMenuId).removeAllListeners();
            getEl(fieldId).removeAllListeners();
            grpAutoComp.dataReturnEvent.unsubscribeAll();
            getEls('#' + conMenuId + ' li').removeAllListeners();
            getEl(conMenuId).remove();
        });

        return grpAutoComp;
    },

    contactsForAutocomp: function(query) {
        var roster = this.roster;
        var autocompstruct = [];

        for (var g in roster.groups) {
            roster.groups[g].contacts.each(function(ctact) {
                autocompstruct.push([ctact.name, ctact.jid, ctact.status]);
            });
        }
        return this._prepareAutocompArray(autocompstruct, query);
    },

    _prepareAutocompArray: function(results, query) {
        var resultIsArray = typeof results[0] != 'string';

        if (resultIsArray && results.length == 0) {
            return results;
        }

        results = results.sortBy(function(result) {
            if (resultIsArray) {
                return result[0].toLowerCase();
            }
            else {
                return result.toLowerCase();
            }
        });

        if (results.length < 2 || !query || query == '') {
            return results;
        }
        else {
            var frontandback = results.partition(function(result) {
                return (resultIsArray ? result[0].indexOf(query) == 0 : result.indexOf(query) == 0);
            });
            return frontandback[0].concat(frontandback[1]);
        }
    },

    addMenuDiv: function(divId) {
        var menushell = document.createElement('div');
        menushell.id = divId;
        menushell.style.visibility = 'hidden';
        document.body.appendChild(menushell);
        return menushell;
    },
    endUpdate: function() {
        if (this.needsUpdate) {
            this.render(true);
        }
        jive.spank.roster.RosterWindow.superclass.endUpdate.call(this);
    },
    destroy: function() {
        jive.spank.roster.RosterWindow.superclass.destroy.call(this);
    }
});

jive.spank.menu = {};

jive.spank.menu.ContactContext = function(dialog, actions) {
    var id = "contact-conmenu";
    var menushell = document.createElement('div');
    menushell.id = id;
    menushell.style.visibility = 'hidden';
    document.body.appendChild(menushell);

    this.menu = new YAHOO.widget.Menu(id, {lazyLoad: true});

    var items = [];
    actions.each(function(action) {
        items.push({text: action.name});
    });
    this.menu.addItems(items);
    this.menu.render(document.body);

    for (var i = 0; i < items.length; i++) {
        this.menu.getItem(i).clickEvent.subscribe(actions[i].action);
    }
    this.dialog = dialog;
};

jive.spank.menu.ContactContext.prototype = {
    show: function(x, y) {
        this.menu.moveTo(x, y);
        this.menu.element.style.zIndex = this.dialog.dialog.lastZIndex + 1;
        this.menu.show();
    },
    destroy: function() {
        this.menu.destroy();
    }
};

jive.spank.chat.Dialog = function(parentWindow, template, configuration) {
    this.parentWindow = parentWindow;

    var elm = document.createElement('div');
    this.id = elm.id = YAHOO.util.Dom.generateId();
    document.body.appendChild(elm);

    var constrained = !configuration.constrained;
	jive.spank.chat.Dialog.superclass.constructor.call(this, elm.id, {
        title: configuration.title,
        modal: configuration.modal,
        constraintoviewport: constrained,
        width: configuration.width,
        height: configuration.height,
        shadow: true,
        proxyDrag: true,
        resizable: false,
        draggable: true,
        x: configuration.x ? configuration.x : (YAHOO.util.Dom.getViewportWidth() / 2)
                - (configuration.width > 0 ? (configuration.width / 2) : 0),
        y: configuration.y ? configuration.y : (YAHOO.util.Dom.getViewportHeight() / 2)
                - (configuration.height > 0 ? configuration.height / 2 : 0),
        closable: true
    });
    this.dialog = this;

    if (configuration.templateKeys) {
        var templateKeys = configuration.templateKeys;
        templateKeys.id = this.id;
        template.append(this.body.dom, templateKeys);
    }
    else {
        template.append(this.body.dom, {id: this.id});
    }

    getEls('#' + this.id + ' .jive-closedialog').addListener('click', this.hide.bind(this));
    this.addListener('hide', this.destroy.bind(this));
};

YAHOO.extend(jive.spank.chat.Dialog, YAHOO.ext.BasicDialog, {
	destroy: function() {
        YAHOO.ext.EventManager.removeResizeListener(this.adjustViewport, this);
        if(this.tabs){
            this.tabs.destroy(removeEl);
        }
        this.el.update('');
        this.el.remove();
        YAHOO.ext.DialogManager.unregister(this);
        
        this.proxy.remove();
        this.shadow.remove();
        if (this.mask) {
            this.mask.remove();
        }
//		this.purgeListeners();
	}
});

jive.spank.dialog = {};

jive.spank.dialog.StartChat = function(callback) {
    var chatDlog = new jive.spank.chat.Dialog(this,
            jive.spank.chat.Template.start_chat,
    {title: "Start a chat",
        width: 250, height: 105 }
            );
    chatDlog.dialog.show();

    var startChat = function() {
        var thejid = $F(chatDlog.id + '-jid');
        if (thejid.replace(/^\s+|\s+$/g, '') != '') {
            callback(this, {jid: thejid});
            getEl(chatDlog.id + '-startbtn').removeAllListeners();
            chatDlog.dialog.hide();
        }
        else {
            $(chatDlog.id).focus();
        }
    };
    $(chatDlog.id + '-jid').focus();
    getEl(chatDlog.id + '-startbtn').addListener("click", startChat);
};

jive.spank.dialog.CreateConference = function(parentWindow, configuration) {
	if(!configuration) {
		configuration = {};
	}
	configuration = $H(configuration).merge(this._configuration);
	jive.spank.dialog.CreateConference.superclass.constructor.call(this, parentWindow,
		jive.spank.chat.Template.muccreation, configuration);
	this.events = $H(this.events).merge({
		"muccreated": true
	});
	this.addListener("hide", this.onHide.bind(this));
	getEl(this.id + '-private').addListener('click', this._privateCheckboxListener.bind(this));
	getEl(this.id + '-createroom').addListener('click', this._createRoomListener.bind(this));
};

YAHOO.extend(jive.spank.dialog.CreateConference, jive.spank.chat.Dialog, {
	_configuration: {
            title: "Create a Conference",
            width: 285, height: 285
	},
	_createRoomListener: function() {
		var privflag = getEl(this.id + '-private');
		var thingOne = $F(this.id + '-roompw');
		var thingTwo = $F(this.id + '-roomconfirm')
		if (privflag.dom.checked && thingOne != thingTwo) {
			alert("Sorry, your password and confirmation don't match.");
			$(this.id + '-roompw').select();
			return false;
		}
		this.fireEvent("muccreated", this, this.getValues());
	},
	_privateCheckboxListener: function() {
		// toggle style on labels
		getEls('#' + this.id + ' .fieldset label').toggleClass('disabled');
		// toggle enabled on fields
		getEl(this.id + '-roompw').dom.disabled = getEl(this.id + '-roomconfirm').dom.disabled =
			!getEl(this.id + '-private').dom.checked;
	},
	focus: function() {
		getEl(this.id + '-roomname').dom.focus();
	},
	getValues: function() {
		return {
			name: $F(this.id + '-roomname'),
			topic: $F(this.id + '-roomtopic'),
			isPermanent: $(this.id + '-permanent').checked,
			isPrivate: $(this.id + '-private').checked,
			password: $F(this.id + '-roompw'),
			confirmPassword: $F(this.id + '-roomconfirm')
		};
	},
	onHide: function() {
		getEl(this.id + '-private').removeAllListeners();
		getEl(this.id + '-createroom').removeAllListeners();
	}
});

if (window.jive_enable_grid) {
    jive.spank.dialog.UserSearch = function(parentWindow, instructions, searchForm, configuration) {
        this._validateArgs($A(arguments));
        if (!configuration) {
            configuration = {
                showServerSelection: false
            };
        }
        configuration.templateKeys = {
            instructions: instructions
        }
        configuration = $H(configuration).merge(this._configuration);
        var template = this._createTemplate(configuration, searchForm);
        jive.spank.dialog.UserSearch.superclass.constructor.call(this, parentWindow,
                template, configuration);
        this.events = $H(this.events).merge({
            "search": true,
            "selected": true
        });
        this._initListeners();

        this.addListener("hide", this.onHide.bind(this));
        this.addListener("show", this.onShow.bind(this));

        this._buildSearchGrid(this.id + "-search-grid");
        this.onShow();
        this.searchGrid.render();
    };

    YAHOO.extend(jive.spank.dialog.UserSearch, jive.spank.chat.Dialog, {
        _validateArgs: function(args) {
            if(!args[1]) {
                throw Error("A search form must be specified and of type array")
            }
        },
        _configuration : {
            title: "Person Search"
        },
        _initListeners : function() {
            getEl(this.id + "-search-submit").addListener("click",
                    this._handleSearchClick.bind(this));
        },
        _template : [
                '<div id="{id}-person-search" class="dbody personsearch">',
                '<div class="jive-dbody-description">',
                '<h1>Person Search</h1>',
                '<p>{instructions}</p>',
                '</div>',
                '<form id="{id}-search-form">',
                '<div class="search-service">',
                '<fieldset>',
                '<legend>Search Service</legend>',
                '<p><label for="service">Search Service</label>',
                '<select name="selectservice" tabindex="{firstTabIndex}">',
                '</select>',
                '<a href="#">Add Service</a>',
                '</p>',
                '</fieldset>',
                '<!--End search-service--></div>',
                '<div class="">',
                '<fieldset>',
                '<legend>Person Search Form</legend>',
                '{searchform}',
                '<p class="buttons"><input type="submit" id="{id}-search-submit" value=',
                '"Search" tabindex="{lastTabIndex}"/></p>',
                '</fieldset>',
                '</div>',
                '</form>',
                '<div id="{id}-search-grid" class="jive-grid">',
                '</div>',
                '</div>'],
        _createTemplate: function(config, searchForm) {
            var template = this._template.slice(0);
            if(!config["showServerSelection"]) {
                var i = template.indexOf('<div class="search-service">');
                var j = template.indexOf('<!--End search-service--></div>');
                template.splice(i, j - i + 1);
            }
            var index = template.indexOf("{searchform}");
            template.splice(index, 1, searchForm.join(''));
            return new YAHOO.ext.DomHelper.Template(template.join(''));
        },
        _handleSearchClick: function(e) {
            this.fireEvent("search", this, this.getSearchFormId());
            Event.stop(e);
        },
        onHide : function() {
            this.searchGrid.destroy(true);
        },
        onShow: function() {
            var personSearch = getEl(this.id + "-person-search");
            var width = Math.max(this.body.getWidth(), personSearch.getWidth());
            this.resizeTo(600, 500);
        },
        updateData: function(data) {
            this.searchGrid.reset(this._createSearchConfig(data));
            this.searchGrid.render();
        },
        getSearchFormId: function() {
            return this.id + "-search-form";
        },
        serializeForm: function() {
            return Form.serialize(this.getSearchFormId());
        },
        _buildSearchGrid: function(searchGridId, data, gridColumns) {
            // finally! build grid
            this.searchGrid = new YAHOO.ext.grid.Grid(searchGridId, this._createSearchConfig(data,
                    gridColumns));
            this.searchGrid.addListener('rowdblclick', this._rowClickHandler.bind(this));

            return this.searchGrid;
        },
        _createColumnModel: function(searchColumns) {
            if (!searchColumns) {
                var i = 1;
                searchColumns = [
                {header: "Username", width: 240, sortable: true, dataIndex: i++},
                {header: "Name", width: 160, sortable: true, dataIndex: i++},
                {header: "E-Mail", width: 70, sortable: true, dataIndex: i++}
                        ];
            }
            return new YAHOO.ext.grid.DefaultColumnModel(searchColumns);
        },
        _createSearchConfig: function(data, gridColumns) {
            if (!data) {
                data = [];
            }
            var gridDataModel = new YAHOO.ext.grid.DefaultDataModel(data);
            return {
                dataModel: gridDataModel,
                colModel: this._createColumnModel(gridColumns),
                selModel: new YAHOO.ext.grid.SingleSelectionModel(),
                monitorWindowResize: false,
                stripeRows: false
            }
        },
        _rowClickHandler: function(grid, rownum, evt) {
            var name = grid.getDataModel().getRow(rownum)[1]
            var jid = grid.getDataModel().getRow(rownum)[0]
            this.fireEvent("selected", this, jid, name);
        }
    });
}
;

jive.spank.dialog.CreateAccount = function(verify) {
    this.dialog = new jive.spank.chat.Dialog(null,
            jive.spank.chat.Template.create_account,
    {title: "Creating an account",
        width: 250, height: 180, modal: true}
            );
    var creator = this.dialog;
    this.nameField = getEl(creator.id + '-name');
    this.passwordField = getEl(creator.id + '-passwd');
    this.createButton = getEl(creator.id + '-submit');
    this.verifyCallback = verify;
    getEl(creator.id + '-confirm').mon("keypress",
            this._doSubmit.createInterceptor(function(evt) {
                return evt.getKey() == 13;
            }));
    getEl(creator.id + '-submit').addListener("click", this._doSubmit.bind(this));

    this.nameField.mon("keypress",
            function() {
                this.dom.style.backgroundColor = "#fff";
            }.bind(this.nameField));

    this.passwordField.mon("keypress",
            function() {
                this.dom.style.backgroundColor = "#fff";
            }.bind(this.passwordField));

    this.nameField.dom.focus();
    creator.dialog.show();
};
jive.spank.dialog.CreateAccount.prototype = {
    _doSubmit: function() {
        var creator = this.dialog;
        var error = $(creator.id + "-error");
        $(creator.id + '-name').style.backgroundColor = "#fff";
        $(creator.id + '-passwd').style.backgroundColor = "#fff";
        if ($F(creator.id + '-name') == '') {
            $(creator.id + '-name').style.backgroundColor = "#f00";
            $(creator.id + '-name').select();
            return false;
        }
        if ($F(creator.id + '-passwd') == '') {
            $(creator.id + '-passwd').style.backgroundColor = "#f00";
            $(creator.id + '-passwd').select();
            return false;
        }
        if ($F(creator.id + '-passwd') != $F(creator.id + '-confirm')) {
            $(creator.id + '-passwd').style.backgroundColor = "#f00";
            $(creator.id + '-passwd').select();
            return false;
        }
        this.createButton.dom.disabled = true;
        this.createButton.hide();
        jive.spank.Spinner.show({x: this.createButton.getX() - 10, y: this.createButton.getY()});
        this.verifyCallback({
            username: $F(creator.id + '-name'),
            password: $F(creator.id + '-passwd')
        });

    },
    verify: function(fields) {
        var creator = this.dialog;
        if (verify) {
            if (verify.name) {
                $(creator.id + '-name').style.backgroundColor = "#f00";
                $(creator.id + '-name').select();
                return;
            }
            if (verify.password) {
                $(creator.id + '-passwd').style.backgroundColor = "#f00";
                $(creator.id + '-passwd').select();
                return;
            }
        }
        getEl(creator.id + '-confirm').removeAllListeners();
        getEl(creator.id + '-submit').removeAllListeners();
        this.nameField.removeAllListeners();
        this.passwordField.removeAllListeners();
        this.dialog.hide();
    }
}

jive.spank.roster.Roster = function (id, separateOfflines) {
    this.el = getEl(id);
    this.groups = {};
    this.events = {
    /**
     * @event contactdblclicked
     * Fires when the user double-clicks a contact in the roster.
     * @param {jive.spank.roster.Roster} roster
     * @param {jive.spank.roster.Contact} contact
     */
        "contactdblclicked": true,
		
        "contactrightclicked": true,
    /**
     * @event offline
     * Fires when a contact starts or stops being 'unavailable' - but not
     * when their status was previously unknown (e.g. not in the first
     * population phase of the roster).
     */
        "offlinemoved": true
    };
    if (separateOfflines) {
        this.offlines = '';
        // will hold id of "virtual roster group" element.
        this._wrappedClick = null;
    }
    ;
};

YAHOO.extend(jive.spank.roster.Roster, YAHOO.ext.util.Observable, {
/**
 * Creates new group and does up the HTML. Hit setRoster instead for setting up
 * many groups at a time.
 *
 * @param {String} displayed name of group.
 * @param {Object} JSON representing the group's members, with usernames as keys.
 */
    addGroup: function(groupName, groupObj) {
        if (this.groups[groupName]) {
            return this.groups[groupName];
        }
        this.groups[groupName] = new jive.spank.roster.RosterGroup(this, groupName, groupObj);
        this.el.insertHtml('beforeEnd', this.groups[groupName].render(false));
        this.groups[groupName]._enableBehaviors();
        return this.groups[groupName];
    },

    addContact: function(userObj, groupName, groupObj) {
        var group = this.addGroup(groupName, groupObj);
        group.addContact(userObj);
    },

    removeContact: function(jid) {
        var victim = this.findContact(jid);
        if (!victim) {
            return;
        }
        var grp = victim.group;
        victim.remove();
        if (grp.contacts.length == 0) {
            grp.remove();
        }
    },

/**
 * Creates groups from a composite JSON obj of the whole roster. Will NOT rewrite
 * HTML, call render() for that.
 *
 * @param {Object} JSON representing groups, with group names as keys, and
 * usernames as keys beneath that.
 */
    setRoster: function(rosterObj) {
        var groupObj;
        for (var groupName in rosterObj) {
            groupObj = rosterObj[groupName];
            this.groups[groupName] = new jive.spank.roster.RosterGroup(this, groupName, groupObj);
        }
    },

    render: function() {
        var groupHTML = '';
        var skipOfflinesFlag = typeof this.offlines != 'undefined';

        var closedGroups = this._getClosedGroups();

        for (var groupToRender in this.groups) {
            groupHTML += this.groups[groupToRender].render(skipOfflinesFlag,
                    closedGroups.indexOf(groupToRender) >= 0);
        }

        groupHTML += this._getOfflineHTML();

        this.el.dom.innerHTML = groupHTML;

        return this;
    },

/**
 * Returns contact obj for the currently selected contact.
 */
    getSelectedUser: function() {
        var victim = $$('ul#' + this.id + ' ul.group-list li.selected')[0];
        var idparts = victim.id.split("-");
        var grouphandle = idparts[3];
        var foundjid = idparts[2];
        return this.findContact(foundjid, grouphandle);
    },

    findContact: function(jid, groupName) {
        if (groupName) groupName = groupName.replace(/[^0-9A-Za-z]/, '_');
        for (var grouploopName in this.groups) {
            if (groupName && grouploopName.replace(/[^0-9A-Za-z]/, '_') != groupName) continue;
            var foundContact = this.groups[grouploopName].contacts.find(function(contact) {
                return contact.jid == jid;
            });
            if (foundContact) {
                return foundContact;
            }
        }
        return null;
    },

    changeContactStatus: function(jid, newMode, newStatus) {
        var contact = this.findContact(jid);
        if (contact) {
            contact.changeStatus(newMode, newStatus);
        }
    },

    getContactStatus: function(jid) {
        var contact = this.findContact(jid);
        if (contact) {
            return contact.status;
        }
    },

    _getOfflineHTML: function() {
        this.offlines = "Offline_Group-" + this.el.id;
        var groups = this.groups;
        var offlineHTML = '';
        for (var groupName in groups) {
            this.groups[groupName].contacts.each(function(contact) {
                if (contact.status == "unavailable") {
                    offlineHTML += contact.render();
                }
            });
        }

        var offlineGroupElement = getEl('group-' + this.offlines);
        var isClosed = false;
        if(offlineGroupElement && offlineGroupElement.dom) {
            var groupLabelChildren = offlineGroupElement.getChildrenByClassName("group-label");
            for(var i = 0; i < groupLabelChildren.length; i++) {
                if(getEl(groupLabelChildren[i]).hasClass('closed')) {
                    isClosed = true;
                }
            }
            offlineGroupElement.remove();
        }
        
        if (offlineHTML == '') {
            return '';
        }
        else {
            return jive.spank.chat.Template.roster_group.applyTemplate({
                id: this.offlines,
                renderClosed: (isClosed ? 'closed' : 'open'),
                online: '',
                groupName: "Offline Group",
                users: offlineHTML

            });
        }
    },

    _enableOfflineBehaviors: function() {
        // behaviors on contacts will be taken care of,
        // but not showing and hiding the group. hence:
        var offlineGroupLabel = getEl('group-label-' + this.offlines);
        if(!offlineGroupLabel || !offlineGroupLabel.dom) {
            return;
        }
        offlineGroupLabel.unselectable();
        this._wrappedClick = offlineGroupLabel.getChildrenByTagName('em')[0].mon('click',
                jive.spank.roster.RosterGroup.toggleGroupVisListener);
        jive.spank.roster.RosterGroup.toggleGroupVisibility(offlineGroupLabel,
                offlineGroupLabel.hasClass("closed"));

        // finally:
        jive.spank.roster.RosterGroup.sortContactHTML(this.offlines);
    },

    sortGroups: function() {
        var prent = this.el;
        if (prent && prent.dom != null) {
            var lines = prent.getChildrenByClassName('group');
            var sorted = lines.sortBy(function(line) {
                return line.id.split("-")[1].toLowerCase();
            });
            sorted.each(function(line) {
                line.appendTo(prent.dom);
            });
        }
        for (var g in this.groups) {
            this.groups[g].sort();
        }
    },

    _getClosedGroups: function() {
        var closedgroups = [];
        var groups = this.el.getChildrenByClassName('closed');
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].firstChild) {
                closedgroups.push(groups[i].firstChild.innerHTML);
            }
        }
        return closedgroups;
    },

    _enableBehaviors: function(doGroupHiding) {
        for (var g in this.groups) {
            this.groups[g]._enableBehaviors(doGroupHiding);
        }
    }
});


jive.spank.roster.RosterGroup = function(roster, name, groupJson) {
    this.name = name;
    this.cleanName = name.replace(/[^A-Za-z0-9]/, '_');

    this._roster = roster;
    this.contacts = [];
    if (groupJson) {
        this._rebuildContacts(groupJson);
    }

    this.id = this.cleanName + "-" + this._roster.el.id;

    this._wrappedClick = null;
};

jive.spank.roster.RosterGroup.prototype = {
    _rebuildContacts: function(json) {
        for (var contactUsername in json) {
            this.contacts.push(new jive.spank.roster.Contact(json[contactUsername], this));
        }
    },

/**
 * Creates new contact and adds to group. Handles the HTML.
 *
 * @param {Object} JSON-ish object with jid, optional status.
 */
    addContact: function(userObject) {
        var newguy = new jive.spank.roster.Contact(userObject, this);
        this.contacts.push(newguy);

        var wheretodraw = "group-list-" + this.id;
        if (typeof this._roster.offlines != 'undefined' && newguy.status == 'unavailable') {
            wheretodraw = "group-list-" + this._roster.offlines;
        }

	var color = uniqueColorForString(newguy.name);	
	
        jive.spank.chat.Template.contact.append(wheretodraw, {
            id: newguy.id,
            status: newguy.status,
            //userid: newguy.name,
            username: newguy.name
        });
        
        this.contacts[this.contacts.length - 1]._enableBehaviors();
        this.sort();
    },

    removeContact: function(jid) {
        var victim = this.getContactByJID(jid);
		if (!victim) {
            return;
        }
        if (victim) {
            victim.remove();
        }
        this.sort();
    },

/**
 * Gets index within this group's contacts array of a given jid.
 *
 * @param {String} a jid, of course.
 */
    contactIndexByJid: function(jid) {
        for (var u = this.contacts.length - 1; u >= 0; u--) {
            if (this.contacts[u].jid == jid) {
                return u;
            }
        }
        return -1;
    },

    getContactByJID: function(jid) {
        var index = this.contactIndexByJid(jid);
        if (index >= 0) {
            return this.contacts[index];
        }
        else {
            return null;
        }
    },

/**
 * Returns HTML for whole group. Doesn't add it anywhere or make things clickable.
 */
    render: function(skipOfflines, isClosed) {
        var renderClosed = (isClosed ? 'closed' : 'open');

        var body = this._getMembersHtml(skipOfflines);
        if (body == '' && skipOfflines) {
            return '';
        }

        return jive.spank.chat.Template.roster_group.applyTemplate({
            id: this.id,
            renderClosed: renderClosed,
            online: 'group-isonline',
            groupName: this.name,
            users: body
        });
    },

/**
 * Sorts contact LIs alphabetically. Only affects the HTML, not the contacts array.
 * Relies on a couple bits from prototype.
 */
    sort: function() {
        jive.spank.roster.RosterGroup.sortContactHTML(this.id);
    },

/**
 * Kill self, no questions asked
 */
    remove: function() {
        var elm = getEl("group-" + this.id);
        YAHOO.ext.EventManager.removeListener(elm, "click", this._wrappedClick);
        this._wrappedClick = null;
        elm.remove();
        delete this._roster.groups[this.name];
    },

    _getMembersHtml: function(skipOfflines) {
        var userDump = '';
        for (var u = 0; u < this.contacts.length; u++) {
            if (!skipOfflines || this.contacts[u].status != 'unavailable') {
                userDump += this.contacts[u].render();
            }
        }
        return userDump;
    },

    _enableBehaviors: function(doGroupHiding) {
        if (doGroupHiding == null) {
            doGroupHiding = true;
        }
        var labell = getEl('group-label-' + this.id);
        if (labell && labell.dom) {
            labell.unselectable();
            var enablee = labell.getChildrenByTagName('em')[0];
            enablee.unselectable();
            if (doGroupHiding) {
                this._wrappedClick = enablee.mon('click',
                        jive.spank.roster.RosterGroup.toggleGroupVisListener);
            }
        }
        // carry thru to contacts
        for (var u = this.contacts.length - 1; u >= 0; u--) {
            this.contacts[u]._enableBehaviors();
        }
    }
};

jive.spank.roster.RosterGroup.toggleGroupVisListener = function(evt) {
    jive.spank.roster.RosterGroup.toggleGroupVisibility(getEl(evt.getTarget().parentNode));
};

jive.spank.roster.RosterGroup.toggleGroupVisibility = function(groupLabelElement, forceNoDisplay) {
    var groupElement = getEl(groupLabelElement.dom.parentNode);
    var groupListElement = groupElement.getChildrenByClassName("group-list")[0];
    if (groupListElement == null) {
        return;
    }
    else {
        groupListElement = groupListElement.dom;
    }
    var display = (groupListElement.style.display == "none" && !forceNoDisplay) ? 'block' : 'none';
    groupListElement.style.display = display;

    groupLabelElement.removeClass(display == 'block' ? "closed" : "open");
    groupLabelElement.addClass(display == 'block' ? "open" : "closed");
}

jive.spank.roster.RosterGroup.sortContactHTML = function(id) {
    var prent = getEl('group-list-' + id);
    if (prent && prent.dom != null) {
        var lines = prent.getChildrenByTagName('li');
        var sorted = lines.sortBy(function(line) {
            return line.dom.innerHTML;
        });
        var line = null;
        for(var i = 0; i < sorted.length; i++) {
        	line = sorted[i];
        	if(line) {
        	if(line.dom.className.indexOf("even") > -1) {
        		if(i % 2 == 0)
        			line.replaceClass("even", "odd");
        	} else {
        		if(i % 2 != 0)
        			line.replaceClass("odd", "even");
        	}
            line.appendTo(prent.dom);
            }
        }
    }
};


jive.spank.roster.Contact = function(userObject, groupRef) {
    this.jid = userObject.getJID();
    this.name = (userObject.getName && userObject.getName() ? userObject.getName()
            : this.jid.toString());
    this.status = typeof userObject != 'string' && userObject.status ? userObject.status :
                  userObject.isSubscriptionPending && userObject.isSubscriptionPending() ? "pending" : "unavailable";
    this.group = groupRef;
    this.id = 'roster-contact-' + this.jid + '-' + this.group.cleanName;
    this.currentMessage = '';

    this._wrappedClick = null;
    this._wrappedDblClick = null;
    this.events = {
        "status": true,
        "offlinemoved": true
    }
};

YAHOO.extend(jive.spank.roster.Contact, YAHOO.ext.util.Observable, {
/**
 * Kill self, no questions asked
 */
    remove: function() {
        var elm = getEl(this.id);
        YAHOO.ext.EventManager.removeListener(elm, "click", this._wrappedClick);
        this._wrappedClick = null;
        YAHOO.ext.EventManager.removeListener(elm, "dblclick", this._wrappedDblClick);
        this._wrappedDblClick = null;
        YAHOO.ext.EventManager.removeListener(elm, "mouseover", this._wrappedMouseOver);
        delete this._wrappedMouseOver;
        YAHOO.ext.EventManager.removeListener(elm, "mouseout", this._wrappedMouseOut);
        delete this._wrappedMouseOut;
		YAHOO.ext.EventManager.removeListener(elm, "contextmenu", this._wrappedContextMenu);
        delete this._wrappedContextMenu;
        elm.remove();
        this.group.contacts.splice(this.group.contactIndexByJid(this.jid), 1);
        delete this.group;
    },

/**
 * Resets contact's HTML classname to reflect newStatus.
 *
 * @param {String} string to hopefully match one of the status class declarations.
 */
    changeStatus: function(newMode, newStatus) {
        newMode = newMode.toLowerCase();

        var contactSpan = getEl(this.id).dom.childNodes[0];
        contactSpan.className = contactSpan.className.replace("roster-contact-" + this.status, "roster-contact-" + newMode);

        var oldMode = (this.status ? this.status : "unavailable");
        var realOldMode = this.status;

        this.status = newMode;

        if (realOldMode == 'unavailable' || newMode == 'unavailable') {
            this.group._roster.fireEvent('offlinemoved');
            // this gets its own var, realOldMode, so we don't fire a lot of
            // false positives when first populating the roster
        }
        this.fireEvent("status", oldMode, newMode);
        this._changeStatusMsg(newStatus);
        return oldMode;
    },

/**
 * Return HTML as string, don't add it anywhere or make it hot.
 */
    render: function() {

    //	var color = window.uniqueColorForString(this.name);
/*    
        if (typeof this.jid == 'string') {
		var i = this.jid.indexOf("@");
		
		if (i < 0) {
		    var userid = this.jid;
		}
		else {
		    var userid = this.jid.slice(0, i);
		}
	} else
            var userid = this.jid.getNode();
*/    
        return jive.spank.chat.Template.contact.applyTemplate({
            id: this.id,
            username: this.name,
            //userid: userid,
            status: this.status,
            message: this.currentMessage
        });
    },

    _changeStatusMsg: function(msg) {
        this.currentMessage = (!msg || msg.strip() == '' ? '' : '- ' + msg);
        var statusElm = getEl(this.id + '-msg');
        statusElm.dom.innerHTML = this.currentMessage;
    },

    _enableBehaviors: function() {
        var elm = getEl(this.id);
        if (elm) {
            elm.unselectable();

            // someday, also add mouseover for the popup profiley thing
            // but for now
            this._wrappedClick = elm.mon('click', function(id) {
                var goodElm = getEl(id);
                var damnbug = goodElm.dom.id;
                getEls('ul.jive-roster ul.group-list li').removeClass('selected');
                document.getElementById(damnbug).className += " selected";
            }.createCallback(this.id));
            this._wrappedDblClick = elm.mon('dblclick', function(evt) {
                evt.stopEvent();
                this.group._roster.fireEvent("contactdblclicked", this.group._roster, this);
            }, this, true);
            this._wrappedContextMenu = elm.mon('contextmenu', function(evt) {
                evt.stopEvent();
                var menutarget = evt.getTarget();
                if (menutarget.tagName.toLowerCase() != "li") {
                    menutarget = menutarget.parentNode;
                    // if more stuff goes into contact HTML this may break
                }

                // select the element
                var damnbug = menutarget.id;
                getEls('ul.jive-roster ul.group-list li').removeClass('selected');
                document.getElementById(damnbug).className += " selected";
                this.group._roster.fireEvent("contactrightclicked", this.group._roster, this,
                        evt.getPageX(), evt.getPageY());
            }, this, true);
            this._wrappedMouseOver = elm.addManagedListener("mouseover", function(id) {
                var goodElm = getEl(id);
                var damnbug = goodElm.dom.id;
                document.getElementById(damnbug).className += " hover";
            }.createCallback(this.id));
            this._wrappedMouseOut = elm.addManagedListener("mouseout", function(id) {
				var elm = getEl(id);
                elm.removeClass('hover');
            }.createCallback(this.id));
        }
    }
});

/**
 * Returns first contact object in the named group that matches the JID given.
 * If no group name is given, searches all groups and returns first match.
 *
 * @param {String} jid valid jid.
 * @param {String} groupName name of group to look in. Cleaned w/ underscores or not, doesn't matter.
 */
jive.spank.roster.Contact.find = function(currentRoster, jid, groupName) {
    var grouploop = currentRoster.groups;
    for (var grouploopName in grouploop) {
        if (groupName && grouploopName.replace(/[^0-9A-Za-z]/, '_') != groupName) continue;
        var foundContact = grouploop[grouploopName].contacts.find(function(contact) {
            return contact.jid == jid;
        });
        if (foundContact) {
            return foundContact;
        }
    }
    return null;
};


jive.spank.chat.Control = function(panelToAdd, title, elm) {
    // elm is a bare HTMLElement, so there's a chance we'll need this:
    elm.id = elm.id || YAHOO.util.Dom.generateId();

    this.el = getEl(elm.id);
    this.el.appendTo(panelToAdd);
    this.el.setDisplayed('block').unselectable();
	this.el.addClassOnOver("hover");

    this.events = {
    /**
     * These all get the Control obj as their first arg and
     * a YAHOO.ext Event as their second.
     */
        "click": true,
        "dblclick": true,
        "mouseover": true,
        "mouseout": true,
        "mousedown": true,
        "mouseup": true,
        "mousemove": true
    };
    this._wrappedListeners = {};
	
    var self = this;
    // i hate to do this, but looping through the event names breaks
    this._wrappedListeners['click'] = this.el.addManagedListener('click', function(evt) {
        self.fireEvent('click', evt);
    });
    this._wrappedListeners['dblclick'] = this.el.addManagedListener('dblclick', function(evt) {
        self.fireEvent('dblclick', evt);
    });
    this._wrappedListeners['mouseover'] = this.el.addManagedListener('mouseover', function(evt) {
        self.fireEvent('mouseover', evt);
    });
    this._wrappedListeners['mouseout'] = this.el.addManagedListener('mouseout', function(evt) {
		this.removeClass("active");
        self.fireEvent('mouseout', evt);
    });
    this._wrappedListeners['mousedown'] = this.el.addManagedListener('mousedown', function(evt) {
		this.addClass("active");
        self.fireEvent('mousedown', evt);
    });
    this._wrappedListeners['mouseup'] = this.el.addManagedListener('mouseup', function(evt) {
		this.removeClass("active");
        self.fireEvent('mouseup', evt);
    });
    this._wrappedListeners['mousemove'] = this.el.addManagedListener('mousemove', function(evt) {
        self.fireEvent('mousemove', evt);
    });

    this.title = title;
    this.panel = panelToAdd;
};
YAHOO.extend(jive.spank.chat.Control, YAHOO.ext.util.Observable, {
    fireEvent: function() {
        if (!this.el.hasClass('disabled')) {
            jive.spank.chat.Control.superclass.fireEvent.call(this, arguments[0], self, arguments[1]);
        }
    },

    remove: function() {
        this.purgeListeners();
        for (var eventName in this.events)
        {
            YAHOO.ext.EventManager.removeListener(eventName, this.el, this._wrappedListeners[eventName]);
        }
        this._wrappedListeners = null;
        this.el.remove();
    },
    enable: function() {
        this.el.removeClass('disabled');
    },
    disable: function() {
        this.el.addClass('disabled');
    },
    toggleEnabled: function() {
        this.el.toggleClass('disabled');
    }
});
jive.spank.chat.Control.add = function(destElm, ctrlTitle, confObj) {
    var body = document.getElementsByTagName('body')[0];
    // fetch elm if ctrlElmId provided
    if (typeof confObj != 'function' && confObj.elmId != null) {
        var elmorig = $(confObj.elmId);
        var elm = elmorig.cloneNode(true);
        elm.id = 'jivectrl-' + elmorig.id;
        elm.style.display = 'none';
        body.appendChild(elm);
    }
    else if (typeof confObj != 'function' && confObj.identifier != null) {
        var elm = document.createElement('div');
        var elmId = elm.id = YAHOO.util.Dom.generateId();
        elm.className = "icon " + confObj.identifier;
        if (confObj.tooltip) {
            elm.setAttribute('title', confObj.tooltip);
        }
        body.appendChild(elm);
    }
    else {
        var classNm = 'autobtn icon';
        var elmId = YAHOO.util.Dom.generateId();
        if (typeof confObj != 'function' && confObj.className != null) {
            classNm = "icon " + confObj.className;
        }
		if(confObj.identifier != null) {
			classNm += " " + confObj.identifier;
		}
        jive.spank.chat.Template.control_btn.append(body, {
            id: elmId,
            cls: classNm,
            text: ctrlTitle
        });
    }
    if (typeof confObj != 'function' && confObj.tooltip) {
        elm.setAttribute('title', confObj.tooltip);
    }

    // make control obj
    var thecontrol = new jive.spank.chat.Control(
            getEl(destElm),
            ctrlTitle,
            elm
            );

    if (typeof confObj == 'function') {
        thecontrol.addListener("click", confObj);
    }
    else {
        for (var eventName in confObj.events) {
            thecontrol.addListener(eventName, confObj.events[eventName]);
        }
    }
    return thecontrol;
};

jive.spank.chat.MucInvitation = function(config) {
    var template = new YAHOO.ext.DomHelper
            .Template(this.template.join(''));
    this.onDestroy = [];

    config.id = config.id || YAHOO.util.Dom.generateId();

    this.el = document.createElement('div');
    this.el.innerHTML = template.applyTemplate(config);
    this.el.id = config.id;
    this.config = config;
}

YAHOO.extend(jive.spank.chat.MucInvitation, YAHOO.ext.util.Observable, {
    events: {
        'accepted': true,
        'declined': true
    },
    callback: function(window) {
        var theId = this.el.id;
        var roomname = getEl(theId + '-room').dom.innerHTML;
        var invitername = getEl(theId + '-inviter').dom.innerHTML;

        var join = getEl(theId + '-join');
        var wrappedFunction = join.mon('click', function(theId, join, event) {
            if(join.id != event.getTarget().id) { return; }
            this.fireEvent('accepted', window, this.config);
            getEl(theId + '-message').dom.innerHTML =
            'You accepted ' + invitername + '\'s invitation to "' + roomname + '".';
            this.destroy();
        }.bind(this, theId, join));
        this.onDestroy.push(YAHOO.ext.EventManager.removeListener
                .createDelegate(YAHOO.ext.EventManager, [join, 'click', wrappedFunction]));

        var decline = getEl(theId + '-decline');
        wrappedFunction = decline.mon('click', function(theId, event) {
            this.fireEvent('declined', window, this.config);
            getEl(theId + '-message').dom.innerHTML =
            'You declined ' + invitername + '\'s invitation to "' + roomname + '".';
            this.destroy();
        }.bind(this, theId));
        this.onDestroy.push(YAHOO.ext.EventManager.removeListener
                .createDelegate(YAHOO.ext.EventManager, [decline, 'click', wrappedFunction]));
    },
    destroy: function() {
        var theId = this.el.id;
        this.onDestroy.each(function(func) {
            func();
        });
        getEl(theId + '-controls').remove();
        this.purgeListeners();
        delete this.config;
    },
    template: [
            '<div id="{id}-mucinvite" class="jive-mucinvite">',
            '<p id="{id}-message"><span id="{id}-inviter">{name}</span> has invited you to ',
            'join the conference "<span id="{id}-room">{chatname}</span>".</p>',
            '<div id="{id}-controls"><a class="mucinviteoption" id="{id}-join" href="#">Accept</a>',
            '<a class="mucinviteoption" id="{id}-decline" href="#">Decline</a></div>',
            '</div>'
            ]
});

if(window.jive_enable_autocomplete == "enable") {
/**
 * Subclassing YUI's autocomplete widget to deal with some weirdnesses in our data sources.
 */
jive.spank.AutoComplete = function(fieldId, containerId, dataSource, confObj) {
    jive.spank.AutoComplete.superclass.constructor.call(this, fieldId, containerId, dataSource, confObj);
}
YAHOO.extend(jive.spank.AutoComplete, YAHOO.widget.AutoComplete);
jive.spank.AutoComplete.prototype._populateList = function(query, results, self) {
	if(results.length > 0) {
    	self.autoHighlight = (results[0][0].indexOf(query) == 0);
    	jive.spank.AutoComplete.superclass._populateList.call(this, query, results, self);
    }
}

jive.spank.AutoComplete.prototype._onTextboxKeyDown = function(v, oSelf) {
    var nKeyCode = v.keyCode;

    switch (nKeyCode) {
        case 9: // tab
            if (oSelf.delimChar && (oSelf._nKeyCode != nKeyCode)) {
                if (oSelf._bContainerOpen) {
                    YAHOO.util.Event.stopEvent(v);
                }
            }
            // select an item or clear out
            if (oSelf._oCurItem) {
                oSelf._selectItem(oSelf._oCurItem);
            }
            else {
                oSelf._toggleContainer(false);
            }
            break;
        case 27: // esc
            oSelf._toggleContainer(false);
            return;
        case 39: // right
            oSelf._jumpSelection();
            break;
        case 38: // up
            YAHOO.util.Event.stopEvent(v);
            oSelf._moveSelection(nKeyCode);
            break;
        case 40: // down
            YAHOO.util.Event.stopEvent(v);
            oSelf._moveSelection(nKeyCode);
            break;
        default:
            break;
    }
};
/**
 * This one tweaks it up a little extra for the roster-group data source, which is a 1-dimensional
 * array, not 2-D like the contacts datasource in the invite menu.
 */
jive.spank.FlatAutoComplete = function(fieldId, containerId, dataSource, confObj) {
    jive.spank.FlatAutoComplete.superclass.constructor.call(this, fieldId, containerId, dataSource, confObj);
}
YAHOO.extend(jive.spank.FlatAutoComplete, YAHOO.widget.AutoComplete);
jive.spank.FlatAutoComplete.prototype._populateList = function(query, results, self) {
    self.autoHighlight = (results[0] && results[0].indexOf(query) == 0);
    jive.spank.AutoComplete.superclass._populateList.call(this, query, results, self);
}
jive.spank.FlatAutoComplete.prototype._updateValue = function(item) {
    item._sResultKey = item._oResultData;
    jive.spank.AutoComplete.superclass._updateValue.call(this, item);
};
} else {
jive.spank.AutoComplete = {};
};

jive.spank.Spinner = {
    show: function(confObj) {
        if (confObj == null) {
            confObj = {};
        }
        if (!this.isShowing) {
            var x = confObj.x || (YAHOO.util.Dom.getViewportWidth() / 2) - 60;
            var y = confObj.y || (YAHOO.util.Dom.getViewportHeight() / 2) - 20;
            var text = confObj.text || 'Loading...';
            this.template.append(document.body, {text: text});
            var theEl = getEl("jive-spinner");
            if (confObj.el && confObj.position) {
                theEl.alignTo(confObj.el, confObj.position);
            }
            else {
                theEl.moveTo(x, y);
            }
            theEl.setStyle('z-index', 20000);
            theEl.show();
            this.isShowing = true;
        }
    },
    isShowing: false,
    hide: function() {
        if (this.isShowing) {
            getEl("jive-spinner").remove();
            this.isShowing = false;
        }
    },
    template: new YAHOO.ext.DomHelper.Template(
            '<div style="visibility: hidden;" id="jive-spinner">' +
            '<img src="chat/images/progress.gif" alt="" />{text}</div>'
            )
};


/**
 * Makes message-text filters, suitable for adding emoticons, links into Wikipedia
 * or whatever you can cook up.
 *
 * @param {String} name a short name by which you can unregister the filter later.
 * @param {RegExp} filterer a regex to test strs against
 * @param {String} filterTo a string to replace the matches with - $1 and $2 and such for matched groups will work
 */
jive.spank.chat.Filter = function(name, filterer, filterTo) {
    this.filterPattern = filterer;
    this.filterReplacement = filterTo;
    this.name = name;
};
jive.spank.chat.Filter.prototype.apply = function(stringToFilter) {
    return stringToFilter.replace(this.filterPattern, this.filterReplacement);
}

jive.spank.chat.Filter.applyAll = function(stringToFilter) {
    // apply filter only to text nodes
    jive.spank.chat.Filter.registeredFilters.each(function(filter) {
        stringToFilter = filter.apply(stringToFilter);
    });
    return stringToFilter;
};

jive.spank.chat.Filter.add = function(name, filterer, filterTo) {
    jive.spank.chat.Filter.registeredFilters.push(new jive.spank.chat.Filter(name, filterer, filterTo));
}
jive.spank.chat.Filter.remove = function(filterName) {
    jive.spank.chat.Filter.registeredFilters.each(function(ftr, i) {
        if (ftr.name == filterName) {
            delete jive.spank.chat.Filter.registeredFilters[i];
            throw $break;
        }
    });
}
jive.spank.chat.Filter.unregisterAll = function() {
    for (var t = jive.spank.chat.Filter.registeredFilters.length - 1; t >= 0; t--) {
        delete jive.spank.chat.Filter.registeredFilters[t];
    }
}

jive.spank.chat.Filter.registeredFilters = [];


// notification nonsense
jive.spank.notifier = {};
jive.spank.notifier.origTitle = null;
jive.spank.notifier.titleMsg = '';
jive.spank.notifier.titleInterval = null;
jive.spank.notifier.countNewMsgs = function() {
    var windowObj;
    var lastOneName = '';
    var newMsgCt = 0;
    for (var windowId in jive.spank.chat.ChatWindow.currentWindow)
    {
        windowObj = jive.spank.chat.ChatWindow.currentWindow[windowId];
        for (var tabJid in windowObj.newMessages) {
            newMsgCt += windowObj.newMessages[tabJid];
        }
    }
    return newMsgCt;
};
jive.spank.notifier.doTitleNotify = function(contactName) {
    var ct = jive.spank.notifier.countNewMsgs();
    if (jive.spank.notifier.titleInterval) {
        window.clearTimeout(jive.spank.notifier.titleInterval);
        jive.spank.notifier.titleInterval = null;
    }
    if (ct <= 0)
    {
        if (jive.spank.notifier.origTitle != null) {
            document.title = jive.spank.notifier.origTitle;
            jive.spank.notifier.origTitle = null;
        }
        return null;
    }
    else {
        jive.spank.notifier.titleMsg = "* " + ct + " new chat message" + (ct > 1 ? "s" : "");
    }
    if (jive.spank.notifier.origTitle == null) {
        jive.spank.notifier.origTitle = document.title;
    }
    jive.spank.notifier.titleInterval = window.setTimeout(jive.spank.notifier.rotateTitle, 2000);
};
jive.spank.notifier.rotateTitle = function() {
    document.title = (document.title == jive.spank.notifier.titleMsg) ?
                     jive.spank.notifier.origTitle :
                     jive.spank.notifier.titleMsg;
    jive.spank.notifier.titleInterval = window.setTimeout(jive.spank.notifier.rotateTitle, 2000);
};

// templates
jive.spank.chat.Template = {
    add_contact: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody addcontact">',
            '<table width="100%" cellpadding="2" cellspacing="0" border="0">',
            '<tr><td width="35%">',
            '<label for="{id}-addusername">Username:</label>',
            '</td><td width="65%">',
            '<input type="text" id="{id}-addusername" value="" />',
            '</td></tr>',

            '<tr><td><label for="{id}-addnickname">Nickname:</label>',
            '</td><td><input type="text" id="{id}-addnickname" value="" /></td></tr>',

            '<tr><td><label for="{id}-addcontact-group">Group:</label></td><td>',
            '<input type="text" id="{id}-addcontact-group" value="" />',
            '</td></tr>',

            '<tr><td colspan="2" align="center" class="masterctrl">',
            '<input type="button" class="btn createcontact" id="{id}-createcontact" value="Add" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-closeaddcontact" value="Cancel" />',
            '</td></tr></table>',
            '</div>'
            ].join('')),
    add_group: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<table width="100%" cellpadding="2" cellspacing="0" border="0">',
            '<tr><td width="25%" rowspan="2">',
    // image goes here?
            '</td><td width="75%">',
            'Enter new group name:<br/>',
            '<input type="text" id="{id}-addgroupname" value="" />',
            '</td></tr>',
            '<tr><td>',
            '<input type="button" class="btn creategroup" id="{id}-creategroup" value="Add" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-closeaddgroup" value="Cancel" />',
            '</td></tr></table>',
            '</div>'
            ].join('')),
    chat_toppane: new YAHOO.ext.DomHelper.Template(
            '<div id="{bodyId}-topchat" class="jive-chat-toppane">' +         
            '<table width="100%"><tr>' +                    
            '<td><h4></h4>' +
            '<p id="{bodyId}-time"><span></span></p>' +
            '<div id="{bodyId}-controls" class="jive-ctrlbar-topchat"></div></td>' +   
	    '<td align="left" class="avatar"><img src="chat/images/sparkweb-avatar.png" height="48" /></td>' +                        
            '</tr></table></div>'
            ),
    contact: new YAHOO.ext.DomHelper.Template(
	    '<li id="{id}" class="even"><span class="roster-contact-{status} username">{username}</span><span id="{id}-msg" class="msg">{message}</span></li>'            
            ),
    control_btn: new YAHOO.ext.DomHelper.Template(
            '<a href="#" class="jive-control-btn {cls}" id="{id}">{text}</a>'
            ),
    control_panel:new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-controls" class="jive-ctrlbar"></div>'
            ),
    create_account: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<table border="0" cellpadding="0" cellspacing="4"><tr>',
            '<td><div class="{id}-name-label">Username:</div></td>',
            '<td><input type="text" id="{id}-name" /></td></tr>',
            '<td><div class="{id}-passwd-label">Password:</div></td>',
            '<td><input type="password" id="{id}-passwd" /></td></tr>',
            '<td><div class="{id}-confirm-label">Confirm Password:</div></td>',
            '<td><input type="password" id="{id}-confirm" /></td></tr>',
            '</table>',
            '<p align="center"><input type="button" class="btn" id="{id}-submit" value="Submit" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="Cancel" /></p>',
            '</div>'
            ].join('')),
    dialog:new YAHOO.ext.DomHelper.Template(
            '<div class="ydlg-hd"><h1>{windowTitle}</h1></div>' +
            '<div id="{bodyId}" class="ydlg-bd">' +
            '<div id="{bodyId}-toppane" class="ydlg-bd jive-toppane"></div>' +
            '</div>' +
            (window.jive_show_branding == "show" ? '<div class="ydlg-ft"><span class="powered-by">Powered By <a href="http://www.jivesoftware.com" title="Visit Jive Software">Jive Software</a></span></div>' : "")
            ),
    message:new YAHOO.ext.DomHelper.Template(
            '<div class="{type}-message from-{from} {mentioned} {consecutive} {action} {msgclass}"><span class="meta" style="color: {color}"><em>({time})</em>' +
            '&nbsp;{from}: </span><span class="message-content">{message}</span></div>'
            ),
    muc_chooser_top: new YAHOO.ext.DomHelper.Template(
            '<div class="dhead chooseconf">Create or join a conference room</div>' +
            '<div id="{tabId}-confcontrols" class="dbody chooseconf">' +
            '<div id="{tabId}-createconf" class="jive-invite-control">Create a Conference</div>' +
            '<div id="{tabId}-refresh" class="jive-invite-control">Refresh List</div>' +
            '</div>'
            ),
    muc_controls: new YAHOO.ext.DomHelper.Template(
            '<div class="muc-ctrl-frame">' +
            '<div id="{jid}-changenick" class="jive-changenick-control">Change Nickname</div>' +
            '<div id="{jid}-control" class="jive-invite-control">Invite contact ' +
            '<img align="absmiddle" src="chat/images/menutri.gif" height="4" width="7" alt="" /></div>' +
            '</div>'
            ),
    muc_subject: new YAHOO.ext.DomHelper.Template(
            '<p>Topic:</p>' +
			'<p id="jive-tab-{jid}-subject" class="jive-topic-name"></p>'
            ),
    mucchooser: new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content">' +
            '<div id="{tabId}-toppane" class="ydlg-bd jive-toppane"></div>' +
            '<div id="{tabId}-roomgrid"></div>' +
            '</div>'
            ),
    muccreation: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<table border="0" cellpadding="0" cellspacing="4"><tr>',
            '<td><label for="{id}-roomname">Room Name:</label></td>',
            '<td><input type="text" id="{id}-roomname" /></td></tr>',
            '<tr><td><label for="{id}-roomtopic">Room Topic:</label></td>',
            '<td><input type="text" id="{id}-roomtopic" /></td></tr>',
            '<tr><td colspan="2"><input type="checkbox" id="{id}-permanent" />',
            '<label for="{id}-permanent"> Make permanent</label></td></tr></table>',
            '<div class="fieldset">',
            '<p class="legend"><span><input type="checkbox" id="{id}-private" />',
            ' Make private</span></p>',
            '<table border="0" cellpadding="0" cellspacing="4"><tr>',
            '<td><label for="{id}-roompw" class="disabled">Password:</label></td>',
            '<td><input type="password" id="{id}-roompw" disabled="disabled" /></td></tr>',
            '<td><label for="{id}-roomconfirm" class="disabled">Confirm Password:</label></td>',
            '<td><input type="password" id="{id}-roomconfirm" disabled="disabled" /></td></tr>',
            '</table></div>',
            '<p align="center"><input type="button" class="btn" id="{id}-createroom" value="Create" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="Cancel" /></p>',
            '</div>'
            ].join('')),
    mucinvitemenu:  new YAHOO.ext.DomHelper.Template(
            '<div id="{jid}-container" class="jive-invite-menu">' +
            '<input id="{jid}-autocomp" type="text">' +
            '<div id="{jid}-autocomp-menu"></div>' +
            '</div>'
            ),
    mucpassword: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<p align="center">Enter password:</p>',
            '<p align="center"><input type="password" class="btn" id="{id}-passwd" value="" /></p>',
            '<p align="center"><input type="button" class="btn" id="{id}-sendsecret" value="Join" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="Cancel" /></p>',
            '</div>'
            ].join('')),
    muctab:new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content ydlg-tab">' +
            '<div id="{tabId}-innerlayout">' +
		    '<p id="{tabId}-subjectbar">Topic<br /> <span id="{tabId}-subject" class="jive-topic-name"></span></p>' + 
            '<div id="{tabId}-history" class="jive-history"></div>' +
            '<textarea id="{tabId}-text" class="jive-tab-message"></textarea>' +
            '</div>' +
            '<div id="{tabId}-sidebarlayout" class="ylayout-inactive-content ydlg-tab">' +
            '<div id="{tabId}-sidebarheader" class="jive-muc-sidebarheader"></div>' +
            '<div id="{tabId}-occupants" class="jive-muc-occupants"></div>' +
			'<div id="{tabId}-userstatus" class="jive-muc-status"></div>' +
            '</div>' +
            '</div>'
            ),
    remove_group: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<p align="center">Are you sure you want to remove \'{name}\'?</p>',
            '<p align="center"><input type="button" class="btn" id="{id}-remove" value="Yes" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="No" /></p>',
            '</div>'
            ].join('')),
    rename: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody">',
            '<div style="text-align: center; padding: 8px;">Rename to: ',
            '<input type="text" id="{id}-name" value="" /></div>',
            '<div style="text-align: center;">',
            '<input type="button" class="btn" id="{id}-rename" value="OK" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-close" value="Cancel" />',
            '</div>',
            '</div>'
            ].join('')),
    roster:new YAHOO.ext.DomHelper.Template(
            '<ul id="{rosterId}" class="jive-roster">{groups}</ul>'
            ),
    roster_group:new YAHOO.ext.DomHelper.Template(
            '<li id="group-{id}" class="group">' +
            '<span id="group-label-{id}" class="group-label {online} {renderClosed}"><em>{groupName}</em></span>' +
            '<ul id="group-list-{id}" class="group-list">{users}</ul>' +
            '</li>'
            ),
    rostertab:new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content">' +
            '<div id="{tabId}-user" class="jive-controlpanel"></div>' +
            '<div id="{tabId}-resources"></div>' +
            '</div>'
            ),
    spinnertab: new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-spinner" class="ylayout-inactive-content ydlg-tab jive-spinnertab">' +
            '<div id="jive-spinner"><img src="chat/images/progress.gif" alt="" />{text}</div>' +
            '</div>'
            ),
    start_chat: new YAHOO.ext.DomHelper.Template([
            '<div class="dbody" style="text-align: center;">',
            '<p>Enter an address:</p>',
            '<p><input type="text" id="{id}-jid" /></p>',
            '<p style="margin-top: 4px;"><input type="button" class="btn" id="{id}-startbtn" value="Start Chat" />',
            '<input type="button" class="btn jive-closedialog" id="{id}-cancel" value="Cancel" /></p>',
            '</div>'
            ].join('')),
    statusMessage: new YAHOO.ext.DomHelper.Template(
            '<div class="status-message {customClass}">{message}</div>'
            ),
    status_panel: new YAHOO.ext.DomHelper.Template(
            '<div class="jive-userstatus">' +
            '<p class="avatar"><img id="{bodyId}-avatar" src="chat/images/sparkweb-avatar.png" height="48" alt="" /></p>' +
            '<h4>{username}</h4>' +
            '<p id="{bodyId}-status" class="jive-mystatus">' +
            '<a href="#" id="{bodyId}-statusmenu-ctrl" class="roster-contact-{statusName}"><span>{status}</span></a></p>' +
            '</div>'
            ),
    sub_request: new YAHOO.ext.DomHelper.Template([
            '<div class="dhead">{nick} ({jid}) wants to add you as a contact.</div>',
            '<div class="dbody fieldset">',

            '<p class="legend"><span><input type="checkbox" id="{id}-add" checked="checked" />',
            ' Add user to your contacts too</span></p>',
            '<table width="100%" cellpadding="2" cellspacing="0" border="0">',
            '<tr><td width="35%">',

            '<label for="addusername">Username:</label>',
            '</td><td id="{id}-jid" width="65%">{jid}</td></tr>',
            '<tr><td><label for="{id}-nick">Nickname:</label>',
            '</td><td><input type="text" id="{id}-nick" value="{nick}" /></td></tr>',
            '<tr><td><label for="{id}-subrequest-group">Group:</label></td><td>',
            '<input type="text" id="{id}-subrequest-group" value="" />',

            '</td></tr></table></div>',
            '<p align="center">',
            '<input type="button" class="btn subrequest" id="{id}-acceptsubrequest" value="Allow" />',
            '<input type="button" class="btn subrequest" id="{id}-denysubrequest" value="Deny" />',
            '</p>'
            ].join('')),
    tab:new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content ydlg-tab">' +
            '<div id="{tabId}-toppane" class="ydlg-bd jive-toppane"></div>' +
            '<div id="{tabId}-history" class="jive-history"></div>' +
            '<textarea id="{tabId}-text" class="jive-tab-message"></textarea>' +
            '</div>'
            ),
    userpane: new YAHOO.ext.DomHelper.Template(
            '<div id="{id}-message">{message}</div>'
            ),
    userpane_loggedin: new YAHOO.ext.DomHelper.Template(
			'<div>' +
            '<input class="jive-muc-username" type="text" id="{id}-uname" value="{uname}"></input>' +
			'<a class="jive-muc-username-edit" id="{id}-uname-edit">change</a>' +
			'</div>' +
			'<div class="jive-muc-presence-control {presence}" id="{id}-presencecontrol">{presence}</div>'
            ),
    userpane_changebtn: new YAHOO.ext.DomHelper.Template(
            '<a id="{id}-changenickbtn" href="javascript:void(0);">Change Nickname</a>'
            ),
	userstatus: new YAHOO.ext.DomHelper.Template(
            '<div id="{tabId}-layout" class="ylayout-inactive-content ydlg-tab">' +
            '<div id="{tabId}-toppane" class="ydlg-bd jive-toppane"></div>' +
            '<div id="{tabId}-history" class="jive-history"></div>' +
            '<textarea id="{tabId}-text" class="jive-tab-message"></textarea>' +
            '</div>'
            )
};

/**
 * @class YAHOO.ext.grid.SpankJSONDataModel
 * This is an implementation of a DataModel used by the Grid. It works
 * with JSON data.
 * <br>Example schema:
 * <pre><code>
 * var schema = {
 *	 root: 'Results.Result',
 *	 id: 'ASIN',
 *	 fields: ['Author', 'Title', 'Manufacturer', 'ProductGroup']
 * };
 * </code></pre>
 * @extends YAHOO.ext.grid.LoadableDataModel
 * @constructor
 */
if(window.jive_enable_grid == "enable") {
YAHOO.ext.grid.SpankJSONDataModel = function(schema) {
    YAHOO.ext.grid.SpankJSONDataModel.superclass.constructor.call(this, YAHOO.ext.grid.LoadableDataModel.JSON);
    /**@private*/
    this.schema = schema;
};
YAHOO.extendX(YAHOO.ext.grid.SpankJSONDataModel, YAHOO.ext.grid.LoadableDataModel, {
/**
 * Overrides loadData in LoadableDataModel to process JSON data
 * @param {Object} data The JSON object to load
 * @param {Function} callback
 */
    loadData : function(data, callback, keepExisting) {
        var idField = this.schema.id;
        var fields = this.schema.fields;
        try {
            if (this.schema.totalProperty) {
                var v = parseInt(eval('data.' + this.schema.totalProperty), 10);
                if (!isNaN(v)) {
                    this.totalCount = v;
                }
            }
            var rowData = [];
            if (this.schema.root) {
                var root = eval('data.' + this.schema.root);
            }
            else {
                var root = data;
            }
            for (var i in root) {
                var node = root[i];
                var colData = [];
                colData.node = node;
                colData.id = (typeof node[idField] != 'undefined' && node[idField] !== '' ? node[idField] : String(i));
                for (var j = 0; j < fields.length; j++) {
                    var val = node[fields[j]];
                    if (typeof val == 'undefined') {
                        val = '';
                    }
                    if (this.preprocessors[j]) {
                        val = this.preprocessors[j](val);
                    }
                    colData.push(val);
                }
                rowData.push(colData);
            }
            if (keepExisting !== true) {
                this.removeAll();
            }
            this.addRows(rowData);
            if (typeof callback == 'function') {
                callback(this, true);
            }
            this.fireLoadEvent();
        }
        catch(e) {
            this.fireLoadException(e, null);
            if (typeof callback == 'function') {
                callback(this, false);
            }
        }
    },

/**
 * Overrides getRowId in DefaultDataModel to return the ID value of the specified node.
 * @param {Number} rowIndex
 * @return {Number}
 */
    getRowId : function(rowIndex) {
        return this.data[rowIndex].id;
    }
});
};

/**
 * And now, extensions to YAHOO.ext.Element
 */
YAHOO.ext.Element.prototype.getParentByClass = function(className, tagName) {
    if (tagName) {
        tagName = tagName.toLowerCase();
    }
    function isMatch(el) {
        if (!el) {
            return false;
        }
        if (className && !YAHOO.util.Dom.hasClass(el, className)) {
            return false;
        }
        return !(tagName && el.tagName.toLowerCase() != tagName);

    }
    ;

    var t = this.dom;
    if (!t || isMatch(t)) {
        return t;
    }
    var p = t.parentNode;
    var b = document.body;
    while (p && p != b) {
        if (isMatch(p)) {
            return p;
        }
        p = p.parentNode;
    }

    return null;
};

YAHOO.ext.Element.prototype.setSelectable = function(which) {
    this.dom.unselectable = which ? 'off' : 'on';
    if (!which) {
        this.applyStyles('-moz-user-select:none;-khtml-user-select:none;');
    }
    else {
        this.applyStyles('-moz-user-select:normal;-khtml-user-select:auto;');
    }
    // skipping the swallowEvent bit - use this and you must take care of that elsewhere
    // hopefully that'll be fine
    return this;
};

org.jive.spank.control = {
    init: function() {
        var logoutLinks = $$("a.jive-logout-link");
        logoutLinks.each(function(action, link) {
            getEl(link).addListener("click", action);
        }.bind(logoutLinks, org.jive.spank.control.actions.logout));
    },
    doConnect: function(username, password, server, viewListeners) {
console.log('doConnect');    
        window.connection = new XMPPConnection("/http-bind/", server,
                new org.jive.spank.control.ConnectionListener(username(), password(),
                        viewListeners));
        connection.connect();
    },
    doLogout: function() {
        var presence = new XMPP.Presence();
        presence.setType("unavailable");
        connection.logout(presence);
    },
	onBeforeUnload: function(event) {
		if (typeof window.rosterWindow == "undefined") {
            return;
        }
		event.returnValue = "Leaving this page will disconnect you from Sparkweb.";
		Event.stop(event);
		return "Leaving this page will disconnect you from Sparkweb.";
	},
    onUnload: function(event) {
        if (typeof window.rosterWindow == "undefined") {
            return;
        }
        org.jive.spank.control.doLogout();
        return true;
    },
    doRegistration: function() {
        window.accountDialog = new jive.spank.dialog.CreateAccount(doRegistrationValidation);
    },
    doRegistrationValidation: function(fields) {

    },
    windows: {}
}

Event.observe(window, 'beforeunload', org.jive.spank.control.onBeforeUnload, false);
Event.observe(window, 'unload', org.jive.spank.control.onUnload, false);

org.jive.spank.control.ConnectionListener = function(username, password, viewListeners) {
    this.username = username;
    this.password = password;
    this.viewListeners = viewListeners;
    viewListeners.onConnecting();
}

org.jive.spank.control.ConnectionListener.prototype = {
    connectionSuccessful: function(connection) {
        window.chatManager = new org.jive.spank.chat.Manager(connection);
        window.chatSessionListener = new org.jive.spank.chat.ChatSessionListener(chatSessionCreated,
                chatSessionClosed);
        chatManager.addChatSessionListener(chatSessionListener);

        window.muc = new org.jive.spank.muc.Manager(connection, chatManager);

        console.debug("Connection successfully established.");
        connection.login(this.username, this.password, "sparkweb");
        this.password = undefined;
    },
    connectionFailed: function() {
        this.password = undefined;
        this.viewListeners.onError();
    },
    connectionClosed: function(closedConnection, error) {
        this._cleanUp(closedConnection, error);
        if (error) {
            this.viewListeners.onError("Your connection to the server has closed, unexpectedly");
        }
        else {
            this.viewListeners.onDisconnected();
        }
    },
    _cleanUp: function(closedConnection, error) {
        destroyAllChatWindows();
        
        if (window.rosterWindow) {
            window.rosterWindow.destroy();
            window.rosterWindow = undefined;
        }
        window.presenceManager = undefined;
        window.rosterManager = undefined;
        window.mucController = undefined;
        
        if(window.searchController) {
            window.searchController.destroy();
            window.searchController = undefined;            
        }

        window.connection = undefined;
        window.chatManager = undefined;
        
        if (window.contactMonitor) {
            window.contactMonitor.destroy();
            window.contactMonitor = undefined;
        }
        window.mucController = undefined;
        window.muc = undefined;
    },
    authenticationSuccessful: function(connection) {
        window.contactMonitor = new org.jive.spank.control.ContactMonitor();
        window.presenceManager = new org.jive.spank.presence.Manager(connection, null, "manual");
        window.presenceManager
                .addPresenceListener(contactMonitor.handlePresence.bind(contactMonitor));
        window.rosterManager = new org.jive.spank.roster.Manager(connection,
                contactMonitor._handleRoster.bind(contactMonitor)
                        .createSequence(this.viewListeners.onConnected), presenceManager);

        window.mucController = new org.jive.spank.control.MucController(muc);
        window.mucController.init();

        window.searchController = new org.jive.spank.control.SearchController("user-search",
                "user-search-submit", org.jive.spank.search.getManager(connection));
        window.searchController.init();

        org.jive.spank.x.chatstate.getManager(chatManager)
                .addStateListener(contactMonitor.handleState.bind(contactMonitor));

        $$(".jive-username").each(function(username, usernameEl) {
            usernameEl.innerHTML = username;
        }.bind(null, connection.username));
                
        getChatWindow("chattest");
        
        getEl('myAvatar').dom.innerHTML = '<img height="48" class="avatar" src="chat/images/sparkweb-avatar.png" />';
    },
    authenticationFailed: function(failedConnection, error) {
        this._cleanUp();
        this.viewListeners.onFailedAuthentication();
    },
    packetsReceived: function() {
        if (typeof window.rosterWindow != "undefined") {
            rosterWindow.beginUpdate();
        }
    },
    packetsProcessed: function() {
        if (typeof window.rosterWindow != "undefined") {
            rosterWindow.endUpdate();
        }
    }
}

org.jive.spank.control.ContactMonitor = function() {

}

org.jive.spank.control.ContactMonitor.prototype = {
    _handleRoster: function(roster) {
        window.rosterWindow = spank.loadComponent("roster");
        rosterWindow.addTab("Contacts");
        rosterWindow.setRoster(roster.getRoster());
        rosterWindow.roster.addListener("contactdblclicked", doOpenContact);
        rosterWindow.roster.addListener("contactrightclicked", this._showContextMenu.bind(this));
        rosterWindow.setUserInfo(connection.username, 'Available');

        enableEmoticons();
        enableAutolinking();

        rosterWindow.addControl("addcontact", {
            events: {
                click: rosterWindow.showAddContact.createDelegate(rosterWindow, [rosterWindow])
            },
            identifier:'button-addcontact',
            tooltip: 'Add Contact'
        });

        window.mucControl = rosterWindow.addControl("muc", {
            events: {
                click: mucController.handleMUCChooser.createDelegate(mucController)
            },
            identifier: 'button-groupchat',
            tooltip: 'Conferences'
        });
        window.mucControl.enable();

        rosterWindow.addControl("startchat", {
            events: {
                click: jive.spank.dialog.StartChat.createDelegate(this, [doOpenContact])
                
            },
            identifier: 'button-startchat',
            tooltip: 'Start Chat'
        });

        rosterWindow.addListener('changestatus', function(window, mode, status) {
            var presence = new XMPP.Presence();
            presence.setMode(mode);
            presence.setStatus(status);
            presenceManager.sendPresence(presence);
            window.changeUserStatus(mode, status);
        });
        rosterWindow.addListener('addcontact', this
                .handleAddContact.bind(contactMonitor));
        rosterWindow.addListener('acceptsubscription', this
                .handleAcceptSubscription.bind(contactMonitor));
        rosterWindow.addListener('denysubscription', this
                .handleDenySubscription.bind(contactMonitor));
        rosterWindow.addListener('removecontact', this
                .handleRemoveContact.bind(contactMonitor));

        rosterWindow.addListener('close', org.jive.spank.control.doLogout);
        rosterWindow.show();
        rosterManager.addRosterListener(this);
    },
    _initContactContextMenu: function() {
        var actions = [{name: "Start Chat", action: this._startChatRosterContact.bind(this)},
        {name: "Rename Contact", action: this._renameRosterContact.bind(this)},
        {name: "Remove Contact", action: this._removeRosterContact.bind(this)}];
        this.contactContextMenu = new jive.spank.menu.ContactContext(rosterWindow, actions);
    },
    _showContextMenu: function(roster, contact, x, y) {
        if(!this.contactContextMenu) {
            this._initContactContextMenu();
        }
        this.selectedContact = contact;
        this.contactContextMenu.show(x, y);
    },
    _startChatRosterContact: function() {
        doOpenContact(rosterWindow.roster, this.selectedContact.jid);
    },
    _renameRosterContact: function() {
        rosterWindow.showRename(this.selectedContact);
    },
    _removeRosterContact: function() {
        rosterWindow.showRemove(this.selectedContact);
    },
    handlePresence: function(presencePacket) {
        var presence;
        if (presencePacket.getType() == "subscribe") {
            this.handleSubscription(presencePacket.getFrom());
            return;
        }
        else {
            presence = this.getMode(presencePacket);
        }
        var jid = presencePacket.getFrom().toBareJID();
        var currentStatus = rosterWindow.getContactStatus(jid);
        if (currentStatus && currentStatus == "composing") {
            return;
        }
        rosterWindow.changeContactStatus(jid, presence.mode, presence.status);
    },
    handleState: function(jid, state, isMUC) {
        var session = chatManager.getSession(jid);
        var jidString;
        if (session) {
            jidString = session.getJIDString();
        }
        else if (isMUC) {
            jidString = jid.toString();
        }
        else {
            jidString = jid.toBareJID();
        }
        var contact = getContact(jidString);
        if (!contact || !contact.changeStatus) {
            return;
        }
        if (state == "composing") {
            contact.changeStatus(state);
        }
        else {
            var presence = this.getMode(getContactPresence(jid));
            contact.changeStatus(presence.mode, presence.status);
        }
    },
    handleAddContact: function(window, jid, nick, group) {
        rosterManager.addEntry(new XMPP.JID(jid), nick, new Array(group));
    },
    handleRemoveContact: function(window, jid) {
        rosterManager.removeEntry(new XMPP.JID(jid));
    },
    onAdded: function(rosterItems) {
        for (var i = 0; i < rosterItems.length; i++) {
            var rosterItem = rosterItems[i];
            this.addContact(rosterItem);
        }
    },
    addContact: function(rosterItem) {
        var groups = rosterItem.getGroups();
        var jid = rosterItem.getJID().toString();
        var presencePacket = presenceManager.getPresence(rosterItem.getJID());
        var status;
        if (presencePacket) {
            status = this.getMode(presencePacket).mode;
        }
        else {
            status = "pending"
        }
        var contact = {
            getJID: function () {
                return jid
            },
            getName: function() {
                return (rosterItem.getName()
                        ? rosterItem.getName() : rosterItem.getJID().toString())
            },
            status: status
        };
        rosterWindow.addContact(contact, (groups[0] ? groups[0] : "Unfiled"));
    },
    onUpdated: function(rosterItems) {
        for (var i = 0; i < rosterItems.length; i++) {
            var rosterItem = rosterItems[i];
            rosterWindow.removeContact(rosterItem.getJID().toString());
            this.addContact(rosterItem);
        }
    },
    onRemoved: function(rosterItems) {
        for (var i = 0; i < rosterItems.length; i++) {
            var rosterItem = rosterItems[i];
            rosterWindow.removeContact(rosterItem.getJID().toString());
        }
    },
    getMode: function(presencePacket) {
        var mode;
        var status;
        if (!presencePacket) {
            return {
                mode: "unavailable",
                status: null
            }
        }
        switch (presencePacket.getType()) {
            case "available":
                mode = presencePacket.getMode();
                if (!mode) {
                    mode = "available";
                }
                status = presencePacket.getStatus();
                break;
            default:
                mode = "unavailable";
                break;
        }
        return {
            mode: mode,
            status: status
        };
    },
    handleSubscription: function(from) {
        if (!rosterManager._users[from.toBareJID()]) {
            rosterWindow.showSubscriptionRequest(from.toString(), from.getNode());
        }
        else {
            this.handleAcceptSubscription(null, false, from.toBareJID())
        }
    },
    handleAcceptSubscription: function(dialog, shouldAddToContact, jid, nick, group) {
        var presence = new XMPP.Presence(new XMPP.JID(jid));
        presence.setType("subscribed");
        connection.sendPacket(presence);

        if (shouldAddToContact) {
            this.handleAddContact(dialog, jid, nick, group);
        }
    },
    handleDenySubscription: function(dialog, shouldAddToContact, jid, nick, group) {
        var presence = new XMPP.Presence(new XMPP.JID(jid));
        presence.setType("unsubscribed");
        connection.sendPacket(presence);
    },
    destroy: function() {
        if (this.contactContextMenu) {
            this.contactContextMenu.destroy();
            delete this.contactContextMenu;
        }
    }
}

org.jive.spank.control.MucController = function(muc) {
    this.muc = muc;
    this.conferenceServers = new Array();  
    this.conferenceServers.push("conference." + window.connection.domain);
    
}

org.jive.spank.control.MucController.prototype = {
    init: function() {
        this.muc.addInvitationsListener(this.handleInvitation.bind(this));
        this.muc.getConferenceServers(function(server) {
            window.mucControl.enable();
            this.conferenceServers.push(server);
        }.bind(this));        
    },
    destroy: function() {
        this.conferenceServers = undefined;
        this.muc = undefined;
    },
    handleInvitation: function(invite) {
        var jid = new XMPP.JID(invite["from"]);
        var session = chatManager.getSession(jid);
        if (!session) {
            session = chatManager.createSession(jid);
        }
        var contact = getContact(session.getJIDString());
        var invitationGUI = new jive.spank.chat.MucInvitation({
            contactJID: jid,
            name: contact.name,
            chatname: invite["room"],
            jid: ''
        });
        invitationGUI.addListener('accepted', this.handleInvitationAccept.bind(this));
        invitationGUI.addListener('declined', this.handleInvitationDecline.bind(this));
        addMessage(contact.jid, contact.name, invitationGUI);
    },
    handleInvitationAccept: function(chatWindow, config) {
        joinMUC(chatWindow, config.chatname.toString(),
                new XMPP.JID(config.chatname.toString()).getNode());
    },
    handleInvitationDecline: function(chatWindow, config) {
        this.muc.declineInvitation(config.contactJID, config.chatname);
    },
    handleNameChange: function(window, roomJID, newName) {
        var room = this.muc.getRoom(new XMPP.JID(roomJID));
        room.changeNickname(newName);
    },
    handleMUCChooser: function() {
        getChatWindow("chattest").preAddMUCChooser();
        var callback = function(mucManager, roomInfoCallback, roomList) {
            mucManager.retrieveRoomsInfo(roomList, roomInfoCallback);
        }.bind(this, this.muc, this.roomInfoCallback);
        this.muc.retrieveRooms(this.conferenceServers[0], callback);
    },
    roomInfoCallback: function(roomList) {
        getChatWindow("chattest").addChooseMUCTab(roomList);
    }
}

org.jive.spank.control.SearchController = function(embeddedSearchFormId, embeddedSearchInputId,
                                                   searchManager)
{
    this.searchManager = searchManager;
    this.embeddedSearchForm = getEl(embeddedSearchFormId);
    this.embeddedSubmit = getEl(embeddedSearchInputId);
    this.searchServices = new Array();
}

org.jive.spank.control.SearchController.prototype = {
    init: function() {
        this.searchManager.getSearchServices(function(searchManager, service) {
            searchManager.getSearchForm(service, this._processSearchForm.bind(this));
        }.bind(this, this.searchManager));
    },
    _processSearchForm: function(service, xDataSearchForm) {
        this.searchServices.push({service: service, searchForm: xDataSearchForm});
        var requiredFields = this.getRequiredFields(service);
        if(requiredFields.length == 1 && requiredFields[0].type == XMPP.XData.FieldType.textSingle)
        {
            var processor = new org.jive.spank.DataFormProcessor(xDataSearchForm);
            this.embeddedSubmit.dom.disabled = false;
            this.embeddedSubmit.addListener("click", this._handleUserSearch.bind(this,
                    service, processor));
        }
    },
    getRequiredFields: function(service) {
        return this._getDataForm(service).getFields(true);
    },
    _getDataForm: function(service) {
        return this._getSearchService(service).searchForm;
    },
    _getSearchService: function(service) {
        return this.searchServices.detect(function(detectingService, service) {
            return service.service.equals(detectingService);
        }.bind(null, service))
    },
    _handleUserSearch: function(service, dataFormProcessor, e) {
        Event.stop(e);
        if(this.searchDialog  && this.searchDialog.isVisible()) {
            this.searchDialog.destroy(true);
        }
        var userSearch = new jive.spank.dialog.UserSearch(rosterWindow,
                dataFormProcessor.getInstructions(), dataFormProcessor.parseForm());
        userSearch.addListener("selected", this._handleSearchUserSelected.bind(this))
        userSearch.addListener("search", this._handleDialogSearch.bind(this, service))
        this.submitSearch(userSearch, service, this.embeddedSearchForm.dom);
        userSearch.show();
        this.searchDialog = userSearch;
    },
    _handleSearchUserSelected: function(searchDialog, jid, name) {
        getChatWindow("chattest").getContactTab(getContact(jid, name));
    },
    _handleDialogSearch: function(service, searchDialog, searchFormId) {
        this.submitSearch(searchDialog, service, searchFormId);
    },
    submitSearch: function(userSearchDialog, service, htmlForm) {
        var fields = Form.getElements(htmlForm);
        var answerForm = this._getDataForm(service).getAnswerForm();
        for(var i = 0; i < fields.length; i++) {
            var htmlField = fields[i];
            if(htmlField.id == this.embeddedSubmit.id || htmlField.type == "submit") {
                continue;
            }

            var answer = new Array();
            var value = Form.Element.getValue(htmlField);
            if(answerForm.getField(htmlField.name).type == "boolean") {
                if(value && value != "") {
                    value = "1";
                }
                else {
                    value = "0";
                }
            }
            answer.push(value);
            answerForm.setAnswer(htmlField.name, answer);
        }

        this.searchManager.submitSearch(service, answerForm,
                this._handleSearchResponse.bind(this, userSearchDialog));
    },
    _handleSearchResponse: function(userSearchDialog, searchResults) {
        if(searchResults.length <= 1) {
            return;
        }
        searchResults.shift();
        var processedSearchResults = searchResults.collect(function(searchResult) {
            return searchResult.collect(function(searchResult) {
                return searchResult.value
            });
        });
        userSearchDialog.updateData(processedSearchResults);
    },
    destroy: function() {
        if(this.searchDialog && this.searchDialog.isVisible()) {
            this.searchDialog.destroy(true);
        }
        this.searchDialog = undefined;
        this.embeddedSubmit.removeAllListeners();
        Form.reset(this.embeddedSearchForm.id);
    }
}

var rosterWindow;

org.jive.spank.control.actions = {
    logout: function(e) {
        org.jive.spank.control.doLogout();
        Event.stop(e);
    },
    createConferenceWindow: function(chatWindow, tabChooserId) {
        var createConference = new jive.spank.dialog.CreateConference(chatWindow);
        createConference.show();
        createConference.focus();

        createConference.addListener("muccreated", org.jive.spank.control.actions.createConference
                .createCallback(createConference, tabChooserId));
    },
    createConference: function(createConference, tabChooserId) {
        var values = createConference.getValues();
        var configuration = {};
        if (values.isPrivate) {
            configuration["muc#roomconfig_passwordprotectedroom"] = "1";
            configuration["muc#roomconfig_roomsecret"] = values.password;
        }
        configuration["muc#roomconfig_roomname"] = values.name;
        if (values.isPermanent) {
            configuration["muc#roomconfig_persistentroom"] = "1";
        }
        if (values.topic && values.topic != '') {
            configuration["muc#roomconfig_roomdesc"] = values.topic;
        }
        var roomAddress = new XMPP.JID(values.name + "@" + mucController
                .conferenceServers[0].toString());
        var room = muc.createRoom(roomAddress);
        getChatWindow("chattest").preAddMUC({name: values.name, jid: roomAddress}, tabChooserId);
        var joinCallback = {
            onSuccess: function(tabChooserId, address, name) {
                var tab = getChatWindow("chattest").addMUC({
                    jid: address, name: name
                }, tabChooserId, rosterWindow);
                // load the occupants
                var occupants = room.getOccupants();
                for (var i = 0; i < occupants.length; i++) {
                    mucOccupantHandler(occupants[i]);
                }
                tab.roster.addListener("contactdblclicked", doOpenContact);
            }.createCallback(tabChooserId, roomAddress, values.name)
        };
        var nick = connection.username;
        room.create(nick, configuration, joinCallback, mucMessageHandler, mucOccupantHandler);
        createConference.hide();
    }
}

function getChatWindow(id) {
    var chatWindow;
    if (org.jive.spank.control.windows[id]) {
        chatWindow = jive.spank.chat.ChatWindow.getWindow(org.jive.spank.control.windows[id]);
    }

    if (!chatWindow) {
        chatWindow = jive.spank.chat.ChatWindow.createWindow();
        org.jive.spank.control.windows[id] = chatWindow.id;
        initializeChatWindow(chatWindow);
    }
    if (!chatWindow.isVisible()) {
        chatWindow.show();
    }
    return chatWindow;
}

function destroyAllChatWindows() {

    if (org.jive.spank.control.windows) {
    
	    for (var id in org.jive.spank.control.windows) {
		jive.spank.chat.ChatWindow.destroyWindow(org.jive.spank.control.windows[id]);
	    }
    }


    delete org.jive.spank.control.windows;    
    org.jive.spank.control.windows = {};


    if (typeof inputMonitor != "undefined") {
        inputMonitor.destroy();
        window.inputMonitor = undefined;
    }   
}

function initializeChatWindow(dialog) {
    dialog.addListener("message", handleMessage);
    dialog.addListener("mucdblclicked", joinMUC);
    dialog.addListener("tabclosed", handleTabClosed);
    dialog.addListener("mucinvitation", handleMUCInvite);
    dialog.addListener("changenameinmuc", mucController.handleNameChange.bind(mucController));
    dialog.addListener("createmuc", org.jive.spank.control.actions.createConferenceWindow);

    if (window.inputMonitor) {
        window.inputMonitor.destroy();
    }
    window.inputMonitor = new org.jive.spank.control.InputMonitor();
    inputMonitor.init();
    dialog.addListener("input", inputMonitor.handleUserInput.bind(inputMonitor));
}

function doOpenContact(roster, contact) {
    var jid;
    if (!(contact.jid instanceof XMPP.JID)) {
        jid = new XMPP.JID(contact.jid);
    }
    else {
        jid = contact.jid;
    }
    var session = chatManager.getSession(jid);
    if (!session) {
        session = chatManager.createSession(jid);
    }
    contact.jid = session.getJIDString();
    var dialog = getChatWindow("chattest");
    dialog.getContactTab(contact, true);
}

function chatSessionCreated(manager, session) {
    console.debug("Chat session created.");
    session.addListener(chatListener);

    var contactObj = getContact(session.getJIDString());

    var dialog = getChatWindow("chattest");
    dialog.getContactTab(contactObj);
    org.jive.spank.x.chatstate.getManager(chatManager).setCurrentState("active", session.getJID());
}

function getContact(jid, name) {
    var bare = new XMPP.JID(jid).getBareJID();
    var contactObj;
    if (muc.getRoom(bare)) {
        var roster = getChatWindow("chattest").tabs[bare].roster;
        contactObj = roster.findContact(jid);
    }
    else {
        contactObj = jive.spank.roster.Contact.find(rosterWindow.roster, jid);
    }
    if (!contactObj) {
        jid = new XMPP.JID(jid);
        contactObj = {
            jid: jid.toString(),
            name: (!name ? jid.getNode() : name),
            status: "unavailable"
        }
    }
    return contactObj;
}

function getContactPresence(jid) {
    var room = muc.getRoom(jid.getBareJID());
    var presence;
    if (room) {
        presence = room.presenceManager;
    }
    else {
        presence = presenceManager;
    }
    return presence.getPresence(jid);
}

function handleMessage(jid, messageBody) {
    jid = new XMPP.JID(jid);
    var type = getChatWindow("chattest").tabs[jid.toString()].type;
    var username;
    if (type == "chat") {
        var session = chatManager.getSession(jid);
        if (!session) {
            session = chatManager.createSession(jid);
        }
        var message = org.jive.spank.x.chatstate.getManager(chatManager)
                .setCurrentState("active", session.getJID());
        session.sendMessage(messageBody, message);
        username = connection.username;
    }
    else if (type == "muc-room") {
        var room = muc.getRoom(jid);
        var message = org.jive.spank.x.chatstate.getManager(chatManager)
                .setCurrentState("active", jid);
        room.sendMessage(messageBody, message);
        username = room.nickname;
    }
    addMessage(jid, username, messageBody, true);
}

org.jive.spank.control.InputMonitor = function() {
    this.composingTimeout = 3000;
    this.inputState = {};
}

org.jive.spank.control.InputMonitor.prototype = {
    init: function() {
        this.inputMonitor = new PeriodicalExecuter(this.monitorFunction.bind(this), 2);
    },
    monitorFunction: function() {
        var time = new Date().getTime();
        for (var inputJID in this.inputState) {
            var input = this.inputState[inputJID];
            if (input.state == "composing" && (time - input.lastInput) >= this.composingTimeout) {
                delete this.inputState[inputJID];
                this.updateState(inputJID, "active");
            }
        }
    },
    handleUserInput: function(jid) {
        if (this.inputState[jid] && this.inputState[jid].state == "composing") {
            this.inputState[jid].lastInput = new Date().getTime();
            return;
        }
        if (!this.inputState[jid]) {
            this.inputState[jid] = {};
        }

        this.inputState[jid].state = "composing";
        this.inputState[jid].lastInput = new Date().getTime();
        this.updateState(jid, "composing");

    },
    updateState: function(jid, newState) {
        console.debug("%s sent to %s", newState, jid);
        jid = new XMPP.JID(jid);
        var session = chatManager.getSession(jid);
        var room;
        if (session) {
            jid = session.getJID();
        }
        else {
            room = muc.getRoom(jid);
        }
        var message = org.jive.spank.x.chatstate.getManager(chatManager)
                .setCurrentState(newState, jid, null, room != null);
        if (message) {
            connection.sendPacket(message);
        }
    },
    destroy: function() {
        this.inputMonitor.stop();
        this.inputState = {};
    }
}
function addMessage(jid, name, msg, isLocal, time) {
    getChatWindow("chattest").getContactTab({jid: jid, name: name});
    var msgObj = msg;
    if (typeof msg == 'string') {
        msgObj = {body: msg, isLocal: isLocal, time: time};
    }
    getChatWindow("chattest").addMessage(jid, name, msgObj);
}

function joinMUC(chatWindow, address, name, tabChooserId, password, shouldJoinAgain) {
    var roomAddress = new XMPP.JID(address);
    var room = muc.getRoom(roomAddress);
    if (room || (getChatWindow("chattest").getTabByJID(address) && !shouldJoinAgain)) {
        getChatWindow("chattest").getTabByJID(address).activate();
        return;
    }
    // check to see if we are already in the process of joining this room
    if (!getChatWindow("chattest").getTabs().items['jive-tab-' + address + '-spinner']) {
        chatWindow.preAddMUC({name: name, jid: address}, tabChooserId);
    }
    if (!room) {
        room = muc.createRoom(roomAddress);
    }
    if (!name) {
        name = roomAddress.getNode();
    }
    var joinCallback = {
        onSuccess: function() {
            var tab = getChatWindow("chattest").addMUC({
                jid: address, name: name
            }, tabChooserId, rosterWindow);
            // load the occupants
            var occupants = room.getOccupants();
            for (var i = 0; i < occupants.length; i++) {
                mucOccupantHandler(occupants[i]);
            }
            tab.roster.addListener("contactdblclicked", doOpenContact);
        },
        onError: function(packet) {
            if (packet.getError() == '401') {
                getChatWindow("chattest").showMUCPassword({jid: address, name: name},
                        null, function(password) {
                    if (!password) {
                        getChatWindow("chattest").removeMUCSpinner(address);
                    }
                    else {
                        joinMUC(chatWindow, address, name, tabChooserId, password, true);
                    }
                });
                return;
            }
            chatWindow.removeMUCSpinner(address);
        }
    }
    var nick = connection.username;
    room.join(nick, password, joinCallback, mucMessageHandler, mucOccupantHandler);
}

var mucMessageHandler = {
    messageReceived: function(message) {
        var from = message.getFrom();
        var room = from.toBareJID();
        var nick = from.getResource();

        var body = message.getBody();
        var isLocal = muc.getRoom(room).nickname.toLowerCase() == nick;
        var time = message.getExtension("x", "jabber:x:delay");
        if ((time || !isLocal) && body) {
            if (time) {
                time = new XMPP.DelayInformation(time).getDate()
                        .toLocaleTimeString();
            }
            if (nick) {
                addMessage(room, nick, body.body, isLocal, time);
            }
            else {
                getChatWindow("chattest").addStatusMessage(room, body.body);
            }
        }
    },
    invitationDeclined: function(decline) {
        var jid = decline.from;
        var contact = getContact(jid);
        var name = jid;
        if (contact) {
            name = contact.name;
        }
        getChatWindow("chattest").addStatusMessage(decline.room.toString(),
                name + " has declined the invitation to join the room.")
    },
    subjectUpdated: function(room, updater, newSubject) {
        getChatWindow("chattest").setSubject(newSubject, room.jid.toString());
    }
}

function mucOccupantHandler(occupant) {
    var room = occupant.getRoom();
    var mucRoom = muc.getRoom(new XMPP.JID(room));
    if (!mucRoom || !mucRoom.isJoined) {
        return;
    }
    var jid = occupant.presence.getFrom();
    var tab = getChatWindow("chattest").tabs[room];
    if (!tab) {
        return;
    }
    var participants = tab.participants;
    if (!participants) {
        return;
    }

    var contact = participants.getContactByJID(jid.toString());
    var mode;
    var status;
    switch (occupant.presence.getType()) {
        case "available":
            mode = occupant.presence.getMode();
            if (!mode) {
                mode = "available";
            }
            status = occupant.presence.getStatus();
            break;
        default:
            mode = "unavailable";
            break;
    }
    if (!contact && mode != "unavailable") {
        contact = participants.addContact({
            jid: jid,
            getJID: function() {
                return this.jid.toString()
            },
            status: mode,
            getName: function() {
                return occupant.getNick()
            }
        });
        getChatWindow("chattest").addStatusMessage(room,
                occupant.getNick() + " has joined the room.");
    }
    else if (contact && mode == "unavailable") {
        contact.changeStatus(mode);
        participants.removeContact(jid.toString());
        getChatWindow("chattest").addStatusMessage(room,
                occupant.getNick() + " has left the room.");
    }
    else if (contact) {
        contact.changeStatus(mode);
    }
}

function handleTabClosed(roomObj, tab) {
    switch (tab.type) {
        case "muc-room":
            muc.getRoom(roomObj.jid).leave();
            break;
        case "chat":
            var session = chatManager.getSession(new XMPP.JID(roomObj.jid.toString()));
            if (session) {
                chatManager.closeChatSession(session);
            }
            break;
    }
}

function handleMUCInvite(chatWindow, inviteeJID, roomJID) {
    muc.getRoom(roomJID).invite(new XMPP.JID(inviteeJID));
    var contact = getContact(inviteeJID);

    var message = contact.name + " has been invited to join the room.";
    chatWindow.addStatusMessage(roomJID, message);
}

function chatSessionClosed(manager, session) {
    console.debug("Chat session closed.");
}

var chatListener = {
    messageRecieved: function(session, message) {
        if (!message.getBody() || message.getBody().body == "") {
            return;
        }
        var name = getChatWindow("chattest").tabs[session.getJIDString()].contact.name;
        addMessage(session.getJIDString(), name, message.getBody().body);
    }
}

function enableEmoticons() {
    var smilies = [
            ['angry',         /&gt;:o|&gt;:-o|&gt;:O|&gt;:-O/g ],
            ['confused',     /\?:\|/g ],
            ['cool',         /B-\)|8-\)/g ],
            ['cry',         /:\'\(/g ],
            ['devil',         /\]:\)/g ],
            ['grin',         /:-D|:D/g ],
            ['happy',         /:-\)|:\)/g ],
            ['laugh',         /:\^0/g ],
            ['love',         /:x/g ],
            ['mischief',     /;\\/g ],
            ['sad',         /:-\(|:\(/g ],
            ['silly',         /:-p|:-P|:P|:p/g ],
            ['wink',         /;-\)|;\)/g ]
            ];
    smilies.each(function(smileyArr) {

        jive.spank.chat.Filter.add(smileyArr[0], smileyArr[1],
                '<img src="chat/images/emoticons/' + smileyArr[0] + '.gif" alt="" />'
                );
    });
}

function enableAutolinking() {
    jive.spank.chat.Filter.add('uri', /[^\"\']?\b(\w+?:\/\/[^\s+\"\<\>]+)/ig,
            '<a href="$1" target="_blank">$1</a>');
    jive.spank.chat.Filter.add('webaddress', /(\s|^)(www\.[^\s+\"\<\>]+)/ig,
            '<a href="http://$2" target="_blank">$2</a>');
}

function doUserSearch() {
    var userSearch = new jive.spank.dialog.UserSearch(rosterWindow);
    userSearch.show();
}

org.jive.spank.DataFormProcessor = function(dataForm) {
    this.dataForm = dataForm;
}

org.jive.spank.DataFormProcessor.prototype = {
    getInstructions: function() {
        var instructions = this.dataForm.getInstructions();
        return (!instructions ? "" : instructions);
    },
    parseForm: function(parseRequiredFields, formId, submitName) {
        var fields = this.dataForm.getFields(parseRequiredFields);
        var source = new Array();
        var multiple = false;
        for (var i = 0; i < fields.length; i++) {
            var fieldName = fields[i].variable;
            var field = fields[i];
            //noinspection FallthroughInSwitchStatementJS
            switch (field.type) {
                case "boolean":
                    source.push(this.createBooleanHTML(fieldName, field));
                    break;
                case "fixed":
                    source.push(this.createFixedHTML(fieldName, field));
                    break;
                case "jid-multi":
                case "list-multi":
                    multiple = true;
                case "jid-single":
                case "list-single":
                    source.push(this.createListHTML(fieldName, field, multiple));
                    break;
                case "text-multi":
                    multiple = true;
                case "text-single":
                    source.push(this.createTextHTML(fieldName, field, multiple));
                    break;
            }
        }

        if(formId) {
            source.splice(0, 0, '<form id="' + formId + '">');
            source.push('<input type="submit" id="' + formId + '-submit" value="');
            source.push(submitName);
            source.push('"></input>');
            source.push('</form>');
        }

        return source;
    },
    createBooleanHTML: function(fieldName, field) {
        var checked = field.values[0] && field.values[0] == "1";
        return '<p><input name="' + fieldName + '" type="checkbox" value="'
                + field['fieldLabel'] + '"' + (checked ? ' checked' : '') + ' />'
                + field['fieldLabel'] + '</p>';
    },
    createFixedHTML: function(fieldName, field) {
        return '<p>' + field.value[0] + '</p>';
    },
    createListHTML: function(fieldName, field, isMultiSelect) {
        var src = '<p>' + field['fieldLabel'] + ' <select name="' + fieldName + '"'
                + (isMultiSelect ? ' multiple' : '') + '>';
        for (var i = 0; i < field.values.length; i++) {
            src += '<option value="' + field.values[i] + '"/>';
        }
        return src;
    },
    createTextHTML: function(fieldName, field) {
        return '<p>' + field['fieldLabel'] + ' <input type="text" name="' +
               fieldName + '"></p>';
    }
}

YAHOO.ext.EventManager.addListener(window, "load", org.jive.spank.control.init);


