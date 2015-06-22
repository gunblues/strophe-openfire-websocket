state = {};
state.MAX_MESSAGES = 30;
state.PANEL_STATE = {
                     NORMAL: 'normal',
                     EXPANDED: 'expanded',
                     MINIMIZED: 'minimized',
                     COLLAPSED: 'collapsed'
                    };
state.PANEL_TYPE = {
                    CHAT: 'chat',
                   };
state.PRESENCE_TYPE = {
                       UNKNOWN: 'unknown',
                       INVITED: 'invited',
                       REJECTED: 'rejected',
                       UNAVAILABLE: 'unavailable',
                       DND: 'dnd',
                       XA : 'xa',
                       AWAY: 'away',
                       CHAT: 'chat',
					   ERROR: 'unavailable'
                      };
state.PRESENCE_MESSAGE = {
                          unknown: 'Unknown',
                          invited: 'Invited',
                          rejected: 'Rejected',
                          unavailable: 'Offline',
                          dnd: 'Busy',
                          xa: 'Idle',
                          away: 'Idle',
                          chat: 'Available',
						  error: 'Offline'
                         };
state.PRESENCE_TYPE_ARRAY = [
                            'unknown',
                            'unavailable',
                            'dnd',
                            'xa',
                            'away',
                            'chat'
                            ];
state.MESSAGE_TYPE = {
                      TIME: 'time',
                      INVITE: 'invite',
                      CHAT_SENT: 'chat_sent', 
                      CHAT: 'chat_recieved',
                      NORMAL : 'normal',
                      GROUPCHAT: 'groupchat',
                      HEADLINE: 'headline',
                      ERROR : 'error'
                     };
state.CONSOLE_COMMANDS = {
                        EMPTY: [
                        ],
                        SIGNIN: [{
                            classes: 'chat signin',
                            title: 'Sign In'
                        }],
                        COMPLETE: [
                            {
                                classes: 'signout',
                                title: 'Sign Out'
                            },
                            {
                                classes: 'chat',
                                title: 'Available'
                            },
                            {
                                classes: 'away',
                                title: 'Away'
                            },
                            {
                                classes: 'dnd',
                                title: 'Busy'
                            }
                        ]
                        };

state.INVITATION_STATE = { //????, ?????|?????|jid??
    NORMAL: '',
    INVITED: 'invited',
    INVALID: 'invalid',
};

var defaultState =  {
    user: {   // ??????
          signedin: false,  // ????
          dropped: false,  // ????
          jid: '',
          name: '',
          presence: {
              type: state.PRESENCE_TYPE.UNAVAILABLE,
              message: state.PRESENCE_MESSAGE[state.PRESENCE_TYPE.UNAVAILABLE]
          },
          avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD26p7K0ub2byrWF5X77RwPcntUFeg+CYok0CJozkyMzP8A72cfyAoA4vUdLv8ATz/pVuyr2ccr+YqlXquowQXFlLDcKDEyHdn09a8qFAB7V3/hDS7vTrVjczACXDCED7pwOp9exHtXOeCbbz9cSQ42wIXOfXoP55/CvQaAM/xBZXF/pkltbziJnxnI4YZ6E9hXm1xDLbzvBMhSRDhga9Zrj/iFaAG3vgef9Uw/Mj+tAH//2Q==',  // ????
          contacts: {} // ??? 
    },
    ui: {
        css: '',
        path: chrome.extension.getURL(''),
        console: {
            state: state.PANEL_STATE.COLLAPSED,
            commands: state.CONSOLE_COMMANDS.EMPTY
        },
        pendingThreads: [],  // ???????threadId
        log: {
            message: '',
            level: '' //  DEBUG INFO WARN ERROR
        },
        filter: {
            state: state.PANEL_STATE.COLLAPSED,  // ??????? collapsed | expand
            filter: '',    // ??filter???????
            matchedContacts: [], // ?????
            matchedContactsSum: 0, //???????
            invite: state.INVITATION_STATE.NORMAL,  //????, ?????|?????|jid??
        },
        blocked : false
    },
    threads: [ //?????????
        {
            prototype: 'prototype',
            id: 'prototype',
            user: {
                name: '',
                jid: '',
                presence: {
                    type: '', 
                    message: ''
                }
            },
            ui: {
                type: state.PANEL_TYPE.CHAT,  //???? chat | invited | ...
                state: '',    //?????, minimized | normal |...
                height: '',
                width: '',
                scrollTop: 0, // ????
                unread: '',
                lastActivity: '',  // ??????
                messagebox : {
                    typing: '',    //???????
                    height: 32, //16
                    disabled: false
                }
            },
            messages: [  //??????
            {
                prototype: 'prototype',
                type: '',       //?????chat_sent | chat_recieved | status ??
                from: '',    //?????jid; ??from????????????type?
                time: '',       //??????
                timestamp: '',
                showTime : true,
                content: ''     //????
            }
            ]
        }
   ]
};

$.extend(true, state, defaultState);

$.extend(state, {
    optionUpdated: function(name, value) {
        var stateChange = {report: name, returns: {}};
        switch(name) {
            case 'CONNECTION_PREPARED':
                if (value) {
                    if (JSON.stringify(state.ui.console.commands) == JSON.stringify(state.CONSOLE_COMMANDS.EMPTY) || 
                        JSON.stringify(state.ui.console.commands) == JSON.stringify(state.CONSOLE_COMMANDS.SIGNIN)) {
                        state.ui.console.commands = state.CONSOLE_COMMANDS.SIGNIN;
                        defaultState.ui.console.commands = state.CONSOLE_COMMANDS.SIGNIN;
                        stateChange.returns.commands = state.CONSOLE_COMMANDS.SIGNIN;
                    }
                } else {
                    if (JSON.stringify(state.ui.console.commands) == JSON.stringify(state.CONSOLE_COMMANDS.SIGNIN)) {
                        state.ui.console.commands = state.CONSOLE_COMMANDS.EMPTY;
                        defaultState.ui.console.commands = state.CONSOLE_COMMANDS.EMPTY;
                        stateChange.returns.commands = state.CONSOLE_COMMANDS.EMPTY;
                    }
                }
                break;
            case 'ALIGN':
                switch (value) {
                    case 'left':
                        state.ui.css = 'css/left.css';
                        defaultState.ui.css = 'css/left.css';
                        stateChange.returns.css = state.ui.path + 'css/left.css';
                        stateChange.returns.right = false;
                        break;
                    case 'right':
                        state.ui.css = 'css/right.css';
                        defaultState.ui.css = 'css/right.css';
                        stateChange.returns.css = state.ui.path + 'css/right.css';
                        stateChange.returns.right = true;
                        break;
                    default:
                        break;
                }
                break;
            default: 
                break;
        }

        return stateChange;
    },
    /**
     * @param string report ???
     * @param array parameters ?????
     */
    call: function(report, parameters) {
              // returns ??? parameters 
              var stateChange = {
                  report: report, 
                  returns: parameters
              };

              var returns = stateChange.returns;

              var newState, thread, threadId, content;

              switch (report) {
                  case 'refresh':
                      // follower????, ????????
                      stateChange = this;
                      break;
                  case 'log':
                      // parameters.message;
                      // parameters.level;
                      // returns message level;
                      
                      var message = parameters.message;
                      var level = parameters.level;
                      
                      state.ui.log.message = message;
                      state.ui.log.level = level;
                      
                      returns.message = message;
                      returns.level = level;

                      break;
                  case 'clearInfo':
                      state.ui.log.message = '';
                      state.ui.log.level = '';
                      break;
                  case 'read':
                      // paramters.threadId
                      // no return;
                      var threadId = parameters.threadId;
                      thread = this._getThread(threadId);
                      thread.ui.unread = '';

                      break;
                  case 'presence':
                      // parameters.from
                      // parameters.show
                      // parameters.status
                      // return 
                      var from = parameters.from;
                      var show = parameters.show;
                      var status = parameters.status;
                      var jid = parameters.jid;

                      var type = state.PRESENCE_TYPE[show.toUpperCase()]; 
                      var message = status || state.PRESENCE_MESSAGE[type];
                      
                      if (state.user.contacts[from]) {
                   
                          state.user.contacts[from].presence = {};
                          state.user.contacts[from].presence.type = type;
                          state.user.contacts[from].presence.message = message;
                      }

                      var threadOfJid = this._getThreadByJid(jid);
                     
                      if (threadOfJid) {                    
                          threadOfJid.user.presence.type = type;
                          threadOfJid.user.presence.message = message;
                      }

                      returns.jid = from;
                      returns.presence = {};
                      returns.presence.type = type;
                      returns.presence.message = status;

                      break;
                  case 'filter':
                      // parameters.segment
                      // return matchedContacts

                      var segment = parameters.segment.toLowerCase();
                      var matchedContacts = [];
                      var matchedContactsSum = 0;

                      if (segment !== '') {
                          var contacts = [];
                          for (index in state.user.contacts) {
                              contacts.push(state.user.contacts[index]);
                          }

                          // ???????
                          contacts.sort(function(a, b) {
                              var presenceA = a.presence.type.toLowerCase();
                              var ra = state.PRESENCE_TYPE_ARRAY.indexOf(presenceA);

                              var presenceB = b.presence.type.toLowerCase();
                              var rb = state.PRESENCE_TYPE_ARRAY.indexOf(presenceB);

                              if (ra < rb) {
                                  return 1;
                              } else {
                                  return -1;
                              }
                          });

			  if (segment == " ") {
			
			  } else if (segment == "  ") {
			
			  } else {
			  
			   	if (segment[0] == " ") segment = segment.substring(1);			
				if (segment[0] == " ") segment = segment.substring(1);				   	
			  }
                              	  

                          $.grep(contacts, function(e, i) {
                          
                             if (e.jid.indexOf("@") > -1)
                             {
                                 if (segment == " ")	// use spacebar to filter first 14  online contacts
                                 {
				      if (e.presence.type.toLowerCase() != "unavailable") 
				      {	
				      	matchedContactsSum++;	
				      		
				      	if (matchedContactsSum < 14)
				      	{			      	
				      		matchedContacts.unshift(e);
				      	}
				      }

                                 } else if (segment == "  ")	{ // use double spacebar to next 14 online contacts

				      if (e.presence.type.toLowerCase() != "unavailable") 
				      {	
				      	matchedContactsSum++;	
				      		
				      	if (matchedContactsSum > 13 && matchedContactsSum < 28)
				      	{			      	
				      		matchedContacts.unshift(e);
				      	}
				      }
				      
                                 } else {
                                                            	      
				      var jid = e.jid.toLowerCase();
				      var name = e.name ? e.name.toLowerCase() : "";

				      var match = jid.indexOf(segment);

				      if (match > -1 && matchedContactsSum++ < 14) 
				      {
					  matchedContacts.unshift(e);
					  
				      } else {
				      
					  match = name.indexOf(segment);
					  
					  if (match > -1 && matchedContactsSum++ < 14) {
					      matchedContacts.unshift(e);
					  }
				      }
			         }
			      }
                          });

                      }

                      state.ui.filter.filter = segment;
                      state.ui.filter.scrollTop = 1000;
                      state.ui.filter.matchedContacts = matchedContacts;
                      state.ui.filter.matchedContactsSum = matchedContactsSum;
                      state.ui.filter.invite = state.INVITATION_STATE.NORMAL;

                      returns.matchedContacts = matchedContacts;
                      returns.matchedContactsSum = matchedContactsSum;
                      break;
                  case 'invite':
                      // parameters.jid;
                      // returns.invited;
                      // returns.invalidJid;

                      // TODO jid test ?secretary???
                      var jid = parameters.jid || '';
                      var jidReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                      
                      //if (jid && jidReg.test(jid) === true) {
                      
                      if (jid && jid.indexOf("@") > -1) {
                          state.ui.filter.invite = state.INVITATION_STATE.INVITED;
                          returns.invited = true;
                          returns.invalidJid = false;
                      } else {
                          state.ui.filter.invite = state.INVITATION_STATE.INVALID;
                          returns.invited = false;
                          returns.invalidJid = true;
                      }

                      break;
                  case 'acceptInvitation':
                      // parameters.jid
                      // returns.threadId

                      var jid = parameters.jid;

                      // TODO ask secretary?
                      var threadId = $.md5(jid.toLowerCase());

                      var thread = this._getThread(threadId);

                      thread.ui.messagebox.disabled = false;
                      for(index in thread.messages) {
                          if (thread.messages[index].prototype !== 'prototype') {
                              delete thread.messages[index];
                              thread.messages.length--;
                          }
                      }

                      returns.threadId = threadId;
                      break;
                  case 'rejectInvitation':
                      // parameters.jid
                      // returns.threadId

                      var jid = parameters.jid;

                      // TODO ask secretary?
                      var threadId = $.md5(jid.toLowerCase());

                      var thread = this._getThread(threadId);
                      thread.ui.messagebox.disabled = true;
                      for(index in thread.messages) {
                          if (thread.messages[index].prototype !== 'prototype') {
                              delete thread.messages[index];
                              thread.messages.length--;
                          }
                      }

                      returns.threadId = threadId;
                      break;
                  case 'scrollPanel':
                      // parameters.scrollTop;
                      // parameters.threadId;
                      // no returns;

                      var scrollTop = parameters.scrollTop;

                      var thread = this._getThread(parameters.threadId);

                      if (thread) {
                          thread.ui.scrollTop = scrollTop;
                      }

                      break;
                  case 'togglePanel':
                      //parameters.panelId
                      //parameters.expand option true | fale 
                      //return returns.panelState
                      
                      threadId = parameters.panelId;
                      var expand = parameters.expand;
                      thread = this._getThread(threadId);
                      
                      if (typeof(threadId) !== 'undefined' && typeof(thread) != 'undefined') {
                          if (typeof(expand) === 'undefined') {
                              //toggle
                              if (thread.ui.state === state.PANEL_STATE.NORMAL){
                                  newState = state.PANEL_STATE.MINIMIZED;
                              } else {
                                  newState = state.PANEL_STATE.NORMAL;
                              }
                          } else {
                              newState = expand ? state.PANEL_STATE.NORMAL : state.PANEL_STATE.MINIMIZED;
                          }

                          thread.ui.state = newState;

                          returns.newState = thread.ui.state;
                      }

                      break;
                  case 'connecting':
                      // no paramters
                      // returns blocked;
                      state.ui.blocked = true;

                      returns.blocked = true;
                      break;
                  case 'connected':
                      // parameters.jid
                      // parameters.name
                      // parameters.avatar
                      // returns jid
                      // returns commands

                      state.user.signedin = true;
                      state.user.jid = parameters.jid;
                      state.user.name = parameters.name;
                      state.user.avatar = parameters.avatar;
                      
                      state.user.family = parameters.family;  
                      state.user.given = parameters.given;  
                      state.user.nickname = parameters.nickname;  
                      state.user.middle = parameters.middle;                        

                      state.user.email = parameters.email;  
                      state.user.url = parameters.url;  

                      state.user.workPhone = parameters.workPhone;  
                      state.user.homePhone = parameters.homePhone; 
                      state.user.workMobile = parameters.workMobile;  
                      state.user.homeMobile = parameters.homeMobile;                       

                      state.user.street = parameters.street;  
                      state.user.locality = parameters.locality; 
                      state.user.region = parameters.region;  
                      state.user.pcode = parameters.pcode;                       
                      state.user.country = parameters.country;                       

                      state.user.orgName = parameters.orgName;                       
                      state.user.orgUnit = parameters.orgUnit; 
                      state.user.title = parameters.title; 
                      
                      state.user.presence.type = state.PRESENCE_TYPE.CHAT;
                      state.user.presence.message = state.PRESENCE_MESSAGE[state.PRESENCE_TYPE.CHAT];

                      state.ui.console.commands = state.CONSOLE_COMMANDS.COMPLETE;

                      state.ui.blocked = false;

                      returns.jid = state.user.jid;
                      returns.presence = state.user.presence;
                      returns.commands = state.ui.console.commands;
                      returns.blocked = false;
                                            
                      break;
                  case 'connectError':
                      // no paramters
                      // returns blocked;
                      state.ui.blocked = false;
                      returns.blocked = false;
                      break;
                  case 'signout':
                      // no parameters
                      // return signout true | false
                      
                      delete state.user;
                      delete state.ui;
                      delete state.threads;

                      $.extend(true, state, defaultState);

                      returns.signout = true;
                      returns.defaultState = defaultState;
                      break;
                  case 'changePresence':
                      // parameters.show
                      // parameters.status
                      // retunrs jid
                      // returns presence

                      state.user.presence.type = parameters.show;
                      state.user.presence.message = state.PRESENCE_MESSAGE[parameters.show];

                      returns.jid = state.user.jid;
                      returns.presence = state.user.presence;
                      break;
                  case 'loadUser':
                      // parameters.  see below                   
                      
                      // no returns
                      var jid = parameters.jid;

                      if (parameters.name != "") 
                      {
                      	  state.user.contacts[jid].name = parameters.name;
                      }
                      state.user.contacts[jid].avatar = parameters.avatar;  
                      state.user.contacts[jid].family = parameters.family;  
                      state.user.contacts[jid].given = parameters.given;  
                      state.user.contacts[jid].nickname = parameters.nickname;  
                      state.user.contacts[jid].middle = parameters.middle;                        

                      state.user.contacts[jid].email = parameters.email;  
                      state.user.contacts[jid].url = parameters.url;  

                      state.user.contacts[jid].workPhone = parameters.workPhone;  
                      state.user.contacts[jid].homePhone = parameters.homePhone; 
                      state.user.contacts[jid].workMobile = parameters.workMobile;  
                      state.user.contacts[jid].homeMobile = parameters.homeMobile;    
                      
                      state.user.contacts[jid].street = parameters.street;  
                      state.user.contacts[jid].locality = parameters.locality; 
                      state.user.contacts[jid].region = parameters.region;  
                      state.user.contacts[jid].pcode = parameters.pcode;                       
                      state.user.contacts[jid].country = parameters.country;

                      state.user.contacts[jid].orgName = parameters.orgName;                       
                      state.user.contacts[jid].orgUnit = parameters.orgUnit;                      
                      state.user.contacts[jid].title = parameters.title;                      
                      break;
                  case 'toggleConsole':
                  
                      // parameters.expand option
                      var expand = parameters.expand;

                      if (typeof(expand) === 'undefined') {
                          //toggle
                          if (state.ui.console.state === ''){
                              newState = state.PANEL_STATE.COLLAPSED;
                          } else {
                              newState = '';
                          }
                      } else {
                          newState = expand ? '' : state.PANEL_STATE.COLLASED;
                      }

                      state.ui.console.state = newState;

                      returns.newState = newState;
                      break;
                  case 'scrolling':
                      // parameters.threadId
                      // parameters.scrollTop
                      threadId = parameters.threadId;
                      thread = this._getThread(threadId);

                      var scrollTop = parameters.scrollTop;

                      if (typeof(threadId) !== 'undefined' && typeof(thread) !== 'undefined') {
                          thread.ui.scrollTop = scrollTop;
                      }

                      // no returns
                      break;
                  case 'typing':
                      //parameters.threadId
                      //parameters.content
                      threadId = parameters.threadId;
                      thread = this._getThread(threadId);
                      
                      content = parameters.content;

                      if (typeof(threadId) != 'undefined' && typeof(thread) != 'undefined') {
                          thread.ui.messagebox.typing = content;
                      }
                      
                      // no returns
                      break;

		  case 'jingleEvent':
		  
		      break;
		  	
                  case 'sendIQ':
                      //parameters.iq


		      console.log("sendIQ");
		      console.log(parameters);
		      
		      features['xmpp']._connection._ws.send(parameters.iq);                      
		      
		      // no returns
                      break;
                      
                  case 'resizeTextarea':
                      //parameters.threadId
                      //parameters.height = 34 //16
                      // no returns
                      threadId = parameters.threadId;
                      thread = this._getThread(threadId);

                      var height = parameters.height;
                      //var width = parameters.width;
                      
                      if (typeof(threadId) != 'undefined' && typeof(thread) != 'undefined') {
                          if (typeof(height) != 'undefined') {
                              thread.ui.messagebox.height = height;
                          } else {
                              thread.ui.messagebox.height = 34; //????
                          }
                      }

                      break;
                  case 'send':
                      //parameters.threadId
                      //parameters.message
                      // parameters.timestamp
                      // parameters.time   

            
                      threadId = parameters.threadId;
                      var message = parameters.message;
                      
                      thread = this._getThreadById(threadId);
                      // encode html tag
                      message = $('<div />').text(message).html();
                      message = this._applyFilters(message);

                      if (thread) {
                     
                          var result = this._insertMessage(thread, {type: state.MESSAGE_TYPE.CHAT_SENT,
                                                from: '',
                                                time: parameters.time ? parameters.time : this._now(),
                                                timestamp: parameters.timestamp ? parameters.timestamp : this._now(true),
                                                content: message});
                         
                          //?????????
                          thread.ui.messagebox.typing = '';

                          returns.removeOldest = result.removeOldest;
                          returns.message = result.message;
                          
                      } else {
                     
                      	      var from = parameters.from;
                              var createdThread = $.extend(true, {}, this._getThread('prototype'));

                              var user = {
                                  jid: from,
                                  avatar: state.user.contacts[from].avatar,
                                  name: state.user.contacts[from] ? state.user.contacts[from].name : from,
                                  presence: state.user.contacts[from] ? state.user.contacts[from].presence : {type: '', message: ''}
                              };
                              createdThread.id = threadId;
                              createdThread.chatType = parameters.type;
                              createdThread.user = $.extend(true, {}, createdThread.user, user);
                              createdThread.ui.state = state.PANEL_STATE.COLLAPSED;

                              delete createdThread.prototype;

                              state.threads.unshift(createdThread);
                              
                              this._insertMessage(createdThread, {type: state.MESSAGE_TYPE.CHAT_SENT,
                                                        from: '',
                                                	time: parameters.time ? parameters.time : this._now(),
                                                	timestamp: parameters.timestamp ? parameters.timestamp : this._now(true),
                                                        content: message});  
                                                       
                      }

                      break;                                          
                  case 'recieved':
                      // parameters.from
                      // parameters.threadId
                      // parameters.type
                      // parameters.message
                      // parameters.html = false
                      // parameters.jid
                      // parameters.timestamp
                      // parameters.time   
                      // parameters.newMsg
                      
                      var timestamp = parameters.timestamp;
                      var time = parameters.time;
                      var threadId = parameters.threadId;
                      var from = parameters.from;
                      var type = state.MESSAGE_TYPE[parameters.type.toUpperCase()];
                      
                      if (!parameters.html)
                      {
                      	var message = this._applyFilters($('<div />').text(parameters.message).html());
                      	
                      } else {
                      
                      	var message = parameters.message;
                      }
                      
		      if (parameters.type == "groupchat")
		      {
				var mucNick = Strophe.getResourceFromJid(parameters.jid);
				message = "<b>" + mucNick + "</b>: " + message;
/*				   
				var domain = Strophe.getDomainFromJid(state.user.jid);
				var memberJID = mucNick + "@" + domain;
				
				if (state.user.contacts[memberJID])
				   message = "<img src='" + state.user.contacts[memberJID].avatar + "'/>" + message;
				else
				   message = "<b>" + mucNick + "</b>: " + message;
*/				   
		      }

		      		      
                      thread = this._getThread(threadId, false);

                      if (thread) {
                          // ???????????message
                          var result = this._insertMessage(thread, {type: type,
                                                from: from,
                                                time: time,
                                                timestamp: timestamp,
                                                content: message});
                          thread.ui.unread = 'unread';

                          stateChange.report = 'recieved';
                          returns.removeOldest = result.removeOldest;
                          returns.message = result.message;
                          returns.unread = 'unread';

                      } else {
                          var collapsedThread = this._getThread(threadId, true);

                          if (collapsedThread) {
                              // ??collapsed??
                              this._insertMessage(collapsedThread, {type: type,
                                                        from: from,
                                                        time: time,
                                                        timestamp: timestamp,
                                                        content: message});


			      if (type == "invite")
			      {

				      var user = {
					  jid: from,
					  avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD26p7K0ub2byrWF5X77RwPcntUFeg+CYok0CJozkyMzP8A72cfyAoA4vUdLv8ATz/pVuyr2ccr+YqlXquowQXFlLDcKDEyHdn09a8qFAB7V3/hDS7vTrVjczACXDCED7pwOp9exHtXOeCbbz9cSQ42wIXOfXoP55/CvQaAM/xBZXF/pkltbziJnxnI4YZ6E9hXm1xDLbzvBMhSRDhga9Zrj/iFaAG3vgef9Uw/Mj+tAH//2Q==',
					  name: from,
					  presence: {type: 'unavailable', message: ''}
				      };
			      
			      } else {
			      
				      var user = {
					  jid: from,
					  avatar: state.user.contacts[from].avatar,
					  name: state.user.contacts[from] ? state.user.contacts[from].name : from,
					  presence: state.user.contacts[from] ? state.user.contacts[from].presence : {type: '', message: ''}
				      };
			      }

                          } else {
                              // ????????
                              // copy object
                              var createdThread = $.extend(true, {}, this._getThread('prototype'));
                              stateChange.report = 'recieved';

			      if (type == "invite")
			      {

				      var user = {
					  jid: from,
					  avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD26p7K0ub2byrWF5X77RwPcntUFeg+CYok0CJozkyMzP8A72cfyAoA4vUdLv8ATz/pVuyr2ccr+YqlXquowQXFlLDcKDEyHdn09a8qFAB7V3/hDS7vTrVjczACXDCED7pwOp9exHtXOeCbbz9cSQ42wIXOfXoP55/CvQaAM/xBZXF/pkltbziJnxnI4YZ6E9hXm1xDLbzvBMhSRDhga9Zrj/iFaAG3vgef9Uw/Mj+tAH//2Q==',
					  name: from,
					  presence: {type: 'unavailable', message: ''}
				      };
			      
			      } else {
			      
				      var user = {
					  jid: from,
					  avatar: state.user.contacts[from].avatar,
					  name: state.user.contacts[from] ? state.user.contacts[from].name : from,
					  presence: state.user.contacts[from] ? state.user.contacts[from].presence : {type: '', message: ''}
				      };
			      }
                              createdThread.id = threadId;
                              createdThread.chatType = parameters.type;
                              createdThread.user = $.extend(true, {}, createdThread.user, user);
                              createdThread.ui.state = state.PANEL_STATE.COLLAPSED;

                              delete createdThread.prototype;

                              state.threads.unshift(createdThread);
                              
                              this._insertMessage(createdThread, {type: type,
                                                        from: from,
                                                        time: time,
                                                        timestamp: timestamp,
                                                        content: message});
                          }

                          if (state.ui.pendingThreads.indexOf(threadId) === -1 && parameters.newMsg) {
                              state.ui.pendingThreads.push(threadId);

                              stateChange.report = 'recievedThread';
                          }

                          returns.jid = user.jid;
                          returns.name = user.name;
                          returns.threadId = threadId;                         
                      }

                      break;
                  case 'recievedGroupChatInvitation':
                      // parameters.from;
                      // parameters.chatroom;
                      // parameters.reason;
                      //
                      break;
                      
                  case 'acceptThread':
                      // parameters.threadId
                      // returns.createdThread
                      
                      var threadId = parameters.threadId;
                      thread = this._getThread(threadId, true);

                      if (thread) {
                          // move to beginning of threadList
                          this._moveThread(thread, false);
                          thread.ui.state = state.PANEL_STATE.EXPANDED;

                          returns.createdThread = thread;
                      }
                      
                      // remove 
                      var index = state.ui.pendingThreads.indexOf(threadId);
                      state.ui.pendingThreads.splice(index,1);

                      break;
                  case 'toggleFilterPanel':
                  
                      // parameters.expand option
                      var expand = parameters.expand;

                      if (typeof(expand) === 'undefined') {
                          //toggle
                          if (state.ui.filter.state === state.PANEL_STATE.COLLAPSED) {
                              newState = state.PANEL_STATE.EXPANDED;                                                        
                              
                          } else {
                              newState = state.PANEL_STATE.COLLAPSED;
                          }
                      } else {
                          newState = expand ? state.PANEL_STATE.EXPANDED : state.PANEL_STATE.COLLAPSED;
                      }

                      state.ui.filter.state = newState;

                      returns.newState = newState;
                      break;
                  case 'createThread':
                  
                      // parameters.jid
                      var jid = parameters.jid;
                      var user = state.user.contacts[jid];

                      // TODO ask secretary?
                      threadId = $.md5(jid.toLowerCase());
                      
                      var existedCollapsedThread = this._getThread(threadId, true);

                      if (existedCollapsedThread) {
                          this._moveThread(existedCollapsedThread, true);
                          existedCollapsedThread.ui.state = state.PANEL_STATE.EXPANDED;

                          returns.createdThread = existedCollapsedThread;
                      } else {
                          // copy object
                          var createdThread = $.extend(true, {}, this._getThread('prototype'));

                          createdThread.id = threadId;
                          createdThread.ui.lastActivity = this._now(true);
                          createdThread.user = $.extend(true, {}, createdThread.user, user);
                          delete createdThread.prototype;

                          state.threads.unshift(createdThread);
                          returns.createdThread = createdThread;
                      }

		      if (state.user.contacts[jid].room) 
		      {  
		      	  returns.createdThread.chatType = "groupchat";
		      	  
		      	  if (state.user.contacts[jid].autojoin != "true")
		      	  {
		      	  	features['xmpp']._connection.muc.join(jid, Strophe.getNodeFromJid(state.user.jid));
		      	  }
		      }


                      state.ui.filter = {
                          state: state.PANEL_STATE.COLLAPSED,  // ??????? collapsed | expand
                          scrollTop: 0, // ????
                          filter: '',    // ??filter???????
                          matchedContacts: []
                      };
                      returns.filter = state.ui.filter;

                      break;
                      
                  case 'closeThread':
                      // parameters.threadId
                      var threadId = parameters.threadId;
                      var thread = this._getThread(threadId);

		      if (state.user.contacts[thread.user.jid].room) 
		      {  
		      	  features['xmpp']._connection.muc.leave(thread.user.jid, Strophe.getNodeFromJid(state.user.jid));
		      }
		      
                      thread.ui.state = state.PANEL_STATE.COLLAPSED;
                      thread.ui.lastActivity = this._now(true);
                      var moved = this._moveThread(thread, true);
                      
                      returns.thread = thread;
                      
                      break; 

		  case 'getRoomJids':
		      // parameters.jid
		  
		      break;
		      
		  case 'returnRoomJids':
		  
		      break;
		      		      
		  case 'showProfile':

		      if (state.user.jid)
		      {
			      var profile_url = chrome.extension.getURL('html/vcard.html') + '?user=' + state.user.jid;

			      chrome.tabs.getAllInWindow(null,function(tabs)
			      {
				var profile_tab = tabs.filter(function(t) { return t.url === profile_url; });

				    if(profile_tab.length){

					chrome.tabs.update(profile_tab[0].id, {selected: true});
				    }else{
					chrome.tabs.create({url: profile_url, selected: true});
				    }
				});
			}
			break;

                  case 'openVCard':
                      // parameters.threadId
                      var threadId = parameters.threadId;
                      var thread = this._getThread(threadId);
                      
                      state.user.contacts[thread.user.jid].messages = thread.messages;
                     
                      var vCardURL = chrome.extension.getURL('html/vcard.html?thread=' + threadId + '&user=' + thread.user.jid); 
                      
		      chrome.tabs.getAllInWindow(null, function(tabs)
		      {
			    var vcard_tab = tabs.filter(function(t) { return t.url === vCardURL; });

			    if (vcard_tab.length > 0)
			    {
				chrome.tabs.update(vcard_tab[0].id, {selected: false});
				
			    } else{
			    
				chrome.tabs.create({url: vCardURL, selected: false});
			    }
		      });                      
                      
                      break;
                                            
                      
                  case 'closeOldestThread':
                      // parameters.num
                      var num = parameters.num;
                      
                      var threadIds = [];
                      for (var i = num; i > 0; i--) {
                          var thread =  this._oldestThread();
                          
                          if (thread) {
                              thread.ui.state = state.PANEL_STATE.COLLAPSED;
                              thread.ui.lastActivity = this._now(true);
                              this._moveThread(thread, true);

                              threadIds.push(thread.id);
                          }
                      }

                      returns.threadIds = threadIds;
                      break;
                  case 'disableThread':
                      // parameters.threadId
                      var threadId = parameters.threadId;
                      var thread = this._getThread(threadId, true);

                      thread.ui.messagebox.disabled = true;

                      stateChange.report = 'disableThread';

                      returns.threadId = threadId;
                      break;
                  case 'loadContacts':
                      // parameters.contacts
                      // return true | false

                      var contacts = parameters.contacts;

                      for (index in contacts) {
                      
                          if (contacts[index].invited) {
                              // invited not response
                              contacts[index].presence = {
                                  type: state.PRESENCE_TYPE.INVITED,
                                  message: state.PRESENCE_MESSAGE[state.PRESENCE_TYPE.INVITED]
                              };
                          } else if (contacts[index].rejected) {
                              // rejected
                              contacts[index].presence = {
                                  type: state.PRESENCE_TYPE.REJECTED,
                                  message: state.PRESENCE_MESSAGE[state.PRESENCE_TYPE.REJECTED]
                              };
                          } else if (typeof(contacts[index].presence) === 'undefined') {
				
				if (!state.user.contacts[contacts[index].jid])
				{    
				        contacts[index].presence = { type: state.PRESENCE_TYPE.UNAVAILABLE, 
				                                      message: state.PRESENCE_MESSAGE[state.PRESENCE_TYPE.UNAVAILABLE] 
				                                   };
				        
                                } else {
                          		var oldType = state.user.contacts[contacts[index].jid].presence.type;
                          		var oldMsg = state.user.contacts[contacts[index].jid].presence.message;

				        contacts[index].presence = { type: oldType, 
				                                      message: oldMsg
				                                   };                                
                                }
                          }
                          
                          if (!contacts[index].avatar)
                          	contacts[index].avatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD26p7K0ub2byrWF5X77RwPcntUFeg+CYok0CJozkyMzP8A72cfyAoA4vUdLv8ATz/pVuyr2ccr+YqlXquowQXFlLDcKDEyHdn09a8qFAB7V3/hDS7vTrVjczACXDCED7pwOp9exHtXOeCbbz9cSQ42wIXOfXoP55/CvQaAM/xBZXF/pkltbziJnxnI4YZ6E9hXm1xDLbzvBMhSRDhga9Zrj/iFaAG3vgef9Uw/Mj+tAH//2Q==';
                          	
                          contacts[index].gateway = this._applyGWFilter(contacts[index].jid);
                      }
                      
                      state.user.contacts = $.extend(state.user.contacts, parameters.contacts);
                      break;
                  default:
                      break;

                }
                return stateChange;
        },
        
        _openWindow: function(width, height, url, title) 
        {
		var content = '<iframe width=' + width + ' height=' + height + ' frameborder=0 src=' + url + ' /></iframe>';
		var code = 'if (videoPanel != null) videoPanel.hide(); var videoPanel = new Boxy("' + content + '", {title: "' + title + '", show: true, draggable: true, unloadOnHide: true});';
		chrome.tabs.executeScript(null, {code: code});        
        
        },
                
        _now: function(timestamp) {
            var now = new Date();
            if (timestamp) {
                return now.getTime();
            } else {
                return now.toLocaleTimeString();
            }
        },
                
        _oldestThread: function() {
            var mark = this._now(true);
            var thread = null;
            for (index in state.threads) {
                if (state.threads[index].prototype !== 'prototype' && state.threads[index].ui.state !== state.PANEL_STATE.COLLAPSED) {
                    if (state.threads[index].ui.lastActivity < mark) {
                        mark = state.threads[index].ui.lastActivity;
                        thread = state.threads[index];
                    }
                }
            }

            return thread;
        },
        _trimMessages: function(thread) {
            var messages = thread.messages;
            if (messages.length > state.MAX_MESSAGES) {
                // first is prototype, remove second messages
                messages.splice(1,1);
                return true;
            } else {
                return false;
            }
        },
        _insertMessage: function(thread, message) {
            var longTimePast = message.timestamp - thread.messages[thread.messages.length - 1].timestamp  > 60000; // 1min
            if (thread.messages.length < 2 || longTimePast) {
                message.showTime = true;
            }

            thread.messages.push(message);

            var removeOldest = this._trimMessages(thread);
            thread.ui.lastActivity = this._now(true);

            return {removeOldest: removeOldest, message: message};
        },
        _getThread: function(threadId, includeCollapsed) {
            if (includeCollapsed) {
                var threads = $.grep(state.threads, function(e, i) {
                    return e.ui.state === state.PANEL_STATE.COLLAPSED && e.id === threadId;
                });
            } else {
                var threads = $.grep(state.threads, function(e, i) {
                    return e.ui.state !== state.PANEL_STATE.COLLAPSED && e.id === threadId;
                });
            }

            // ???????
            return threads[0];
        },
        _getThreadById: function(threadId) {

            var threads = $.grep(state.threads, function(e, i) {
                return e.id === threadId;
            });
            return threads[0];
        },        
        _getThreadByJid: function(jid) {
            var threads = $.grep(state.threads, function(e, i) {         
                return e.user.jid === jid;
            });

            // ???????
            return threads[0];
        },
        _moveThread: function(thread, endOrBegin) {
            var index = $.inArray(thread, state.threads);
            if (endOrBegin) {
                // ?????
                state.threads.splice(index, 1);
                state.threads.unshift(thread);
                return true;
            } else {
                var length = state.threads.length;

                // ????
                state.threads.splice(index, 1);
                state.threads.push(thread);
                return true;
            }
        },
	
	_applyGWFilter: function (jid) 
	{
		if (jid.indexOf("@aim.") > -1) return "<img src='" + chrome.extension.getURL("images/gateways/aim.gif") + "' border='0'>";
		if (jid.indexOf("@msn.") > -1) return "<img src='" + chrome.extension.getURL("images/gateways/msn.gif") + "' border='0'>";
		if (jid.indexOf("@xmpp.") > -1) return "<img src='" + chrome.extension.getURL("images/gateways/xmpp.png") + "' border='0'>";
		if (jid.indexOf("@yahoo.") > -1) return "<img src='" + chrome.extension.getURL("images/gateways/yahoo.gif") + "' border='0'>";
		if (jid.indexOf("@gtalk.") > -1) return "<img src='" + chrome.extension.getURL("images/gateways/gtalk.gif") + "' border='0'>";
		if (jid.indexOf("@facebook.") > -1) return "<img src='" + chrome.extension.getURL("images/gateways/facebook.png") + "' border='0'>";
		
		return "";
	},
	
	_applyFilters: function (body) 
	{
		//body = body.replace(/&/gi, "&amp;");
		//body = body.replace(/</gi, "&lt;");
		//body = body.replace(/>/gi, "&gt;");
		//body = body.replace(/\n/gi, "<br>");
		//body = body.replace(/\[b\]/gi, "<b>");
		//body = body.replace(/\[\/b\]/gi, "</b>");
		//body = body.replace(/\[i\]/gi, "<i>");
		//body = body.replace(/\[\/i\]/gi, "</i>");
		//body = body.replace(/\[u\]/gi, "<u>");
		//body = body.replace(/\[\/u\]/gi, "</u>");

		body = body.replace(/:\)/gi, "<img src='" + chrome.extension.getURL("images/emoticons/happy.gif") + "' border='0'>");
		body = body.replace(/:-\)/gi, "<img src='" + chrome.extension.getURL("images/emoticons/happy.gif") + "' border='0'>");
		body = body.replace(/:\(/gi, "<img src='" + chrome.extension.getURL("images/emoticons/sad.gif") + "' border='0'>");
		body = body.replace(/:-\(/gi, "<img src='" + chrome.extension.getURL("images/emoticons/sad.gif") + "' border='0'>");
		body = body.replace(/:D/gi, "<img src='" + chrome.extension.getURL("images/emoticons/grin.gif") + "' border='0'>");
		body = body.replace(/:x/gi, "<img src='" + chrome.extension.getURL("images/emoticons/love.gif") + "' border='0'>");
		body = body.replace(/;\\/gi, "<img src='" + chrome.extension.getURL("images/emoticons/mischief.gif") + "' border='0'>");
		body = body.replace(/B-\)/gi, "<img src='" + chrome.extension.getURL("images/emoticons/cool.gif") + "' border='0'>");
		body = body.replace(/:p/gi, "<img src='" + chrome.extension.getURL("images/emoticons/silly.gif") + "' border='0'>");
		body = body.replace(/X-\(/gi, "<img src='" + chrome.extension.getURL("images/emoticons/angry.gif") + "' border='0'>");
		body = body.replace(/:\^O/gi, "<img src='" + chrome.extension.getURL("images/emoticons/laugh.gif") + "' border='0'>");
		body = body.replace(/:\^0/gi, "<img src='" + chrome.extension.getURL("images/emoticons/laugh.gif") + "' border='0'>");
		body = body.replace(/;\)/gi, "<img src='" + chrome.extension.getURL("images/emoticons/wink.gif") + "' border='0'>");
		body = body.replace(/;-\)/gi, "<img src='" + chrome.extension.getURL("images/emoticons/wink.gif") + "' border='0'>");
		body = body.replace(/:8\}/gi, "<img src='" + chrome.extension.getURL("images/emoticons/blush.gif") + "' border='0'>");
		body = body.replace(/:_\|/gi, "<img src='" + chrome.extension.getURL("images/emoticons/cry.gif") + "' border='0'>");
		body = body.replace(/\?:\|/gi, "<img src='" + chrome.extension.getURL("images/emoticons/confused.gif") + "' border='0'>");
		body = body.replace(/:O/gi, "<img src='" + chrome.extension.getURL("images/emoticons/shocked.gif") + "' border='0'>");
		body = body.replace(/:0/gi, "<img src='" + chrome.extension.getURL("images/emoticons/shocked.gif") + "' border='0'>");
		body = body.replace(/:\|/gi, "<img src='" + chrome.extension.getURL("images/emoticons/plain.gif") + "' border='0'>");
		
		return body;
	}        
});
