/**
 * micro-templating?boss state
 */

var _jingleCalls = {}
var _jingleRequests = {}
var _myJid = null;
var _myName = null;
var _myVideoPanel = null;
var _invitedMUCJids = {};
var _activeMUCJids = {};

var assistant = (function() {

var _template = [
'<script type="text/html" id="gtalklet_template">',
    '<div id="gtalklet_layer" data-blocked="<%=ui.blocked%>">',
        '<style type="text/css">#gtalklet_layer {bottom: -500px; height: 0px;}</style>',

        '<% if (ui.css) { %>',
            '<link rel="stylesheet" href="<%=ui.path%><%=ui.css%>" id="gtalklet_css" media="screen"></link>',
        '<% } %>',

        // 
        '<div id="gtalklet_info" class="gtalklet_panel" style="display:none">',
            '<div class="gtalklet_title_bar <%=ui.log.level%>" data-switch-class="<%=ui.log.level%>">',
                '<div class="gtalklet_info"><%=ui.log.message%></div>',
            '</div>',
        '</div>',

        // 
        '<div id="gtalklet_operation" class="gtalklet_panel" data-switch-class="" <% if (!user.signedin) { %>style="display:none"<% } %>>',
            '<div class="gtalklet_title_bar">',
                '<% if (ui.filter.state == "collapsed") { %>',
                    '<div class="gtalklet_icon_button gtalklet_toggle_filter open" data-switch-class="open"></div>',
                '<% } else {%>',
                    '<div class="gtalklet_icon_button gtalklet_toggle_filter close" data-switch-class="close"></div>',
                '<% } %>',
            '</div>',
        '</div>',

        // 
        '<div id="gtalklet_filter_panel" class="gtalklet_panel <%=ui.filter.state%>" data-switch-class="<%=ui.filter.state%>">',
            '<div class="gtalklet_panel_content_wrapper">',
                '<div class="gtalklet_panel_content">',
                    '<div class="gtalklet_contacts">',
                        '<% if (ui.filter.matchedContactsSum > ui.filter.matchedContacts.length) { %>',
                            '<div class="gtalklet_message"><%=ui.filter.matchedContactsSum - ui.filter.matchedContacts.length%> more...</div>',
                        '<% } %>',
                        '<% if (ui.filter.matchedContactsSum > 0) { %>',
                            '<div class="gtalklet_message prototype"></div>',
                            '<% for(i in ui.filter.matchedContacts) { %>',
                                '<div class="gtalklet_contact" data-jid="<%=ui.filter.matchedContacts[i].jid%>">',
                                    '<div class="gtalklet_contact_wrapper">',
                                        '<div class="gtalklet_presence <%=ui.filter.matchedContacts[i].presence.type%>" data-switch-class="<%=ui.filter.matchedContacts[i].presence.type%>" title="<%=ui.filter.matchedContacts[i].presence.message%>"></div>',
                                        '<div class="gtalklet_contact_name"><%=ui.filter.matchedContacts[i].name%></div>',
                                        '<div class="gtalklet_contact_jid"><%=ui.filter.matchedContacts[i].jid%></div>',
                                    '</div>',
                                '</div>',
                            '<% } %>',
                        '<% } else { %>',
                            '<% if (ui.filter.filter == "") { %>',
                                '<div class="gtalklet_message prototype"></div>',
                                '<div class="gtalklet_message">Search all contacts</div>',
                            '<% } else { %>',
                                '<div class="gtalklet_message prototype"></div>',
                                '<div class="gtalklet_message">No matching contacts</div>',
                            '<% } %>',
                        '<% } %>',
                    '</div>',
                '</div>',
            '</div>',
            '<input type="input" class="gtalklet_filter <% if (ui.filter.invite == "invalid") { %>invalid<% } %>" placeholder="Create a Thread" spellcheck="false" value="<%=ui.filter.filter%>" <% if (ui.filter.invite == "invalid") { %>title="Invalid JID: <%=ui.filter.filter%>"<% } %> />',
            '<% if (ui.filter.invite == "") { %> ',
                '<div class="gtalklet_invite gtalklet_icon_button" title="Invite to chat" <% if (ui.filter.matchedContactsSum || !ui.filter.filter) { %>style="display:none"<% } %>></div>',
            '<% } else if (ui.filter.invite == "invalid") { %>',
                '<div class="gtalklet_invite gtalklet_icon_button" title="Invite to chat"<% if (!ui.filter.filter) { %>style="display:none"<% } %>></div>',
            '<% } else if (ui.filter.invite == "invited") { %>',
                '<div class="gtalklet_invite gtalklet_icon_button invited" title="Invited"></div>',
            '<% } %>',
        '</div>',

        // 
        '<% for(i in threads) { %>',
            '<% if (threads[i].ui.state !== "collapsed") { %>',
                '<div class="gtalklet_thread gtalklet_panel <%=threads[i].ui.state%> <%=threads[i].ui.unread%> <%=threads[i].prototype%>" data-thread-id="<%=threads[i].id%>" data-jid="<%=threads[i].user.jid%>" data-switch-class="<%=threads[i].ui.state%>">',
                   '<div class="gtalklet_title_bar">',
                       '<div class="gtalklet_presence <%=threads[i].user.presence.type%>" title="<%=threads[i].user.presence.message%>" data-switch-class="<%=threads[i].user.presence.type%>" ></div>',
                       '<div class="gtalklet_contact_name" title="<%=threads[i].user.jid%>">',
                           '<%=threads[i].user.name%>',
                       '</div>',                           
                       '<div class="gtalklet_open_audio" title="Start audio conversation"></div>',                        
		       '<div class="gtalklet_open_video" title="Start video conversation"></div>',                        
                       '<div class="gtalklet_close_thread" title="Close conversation"></div>',
                   '</div>',
                   '<div class="gtalklet_panel_content_wrapper">',
                        '<div class="gtalklet_panel_content">',
                            '<div class="gtalklet_toolbar_handler">',
                                '<div class="gtalklet_toolbar">',
                                    '<div class="gtalklet_icon_button gtalklet_clear_timeline" title="Clear Messages"></div>',
                                    '<div class="gtalklet_icon_button gtalklet_go_off_record" title="Go off the record"></div>',
                                    '<div style="clear: both;"></div>',
                                '</div>',
                            '</div>',
                            '<div class="gtalklet_timeline gtalklet_scroll" data-scroll="<%=threads[i].ui.scrollTop%>">',
                                '<% for(mi in threads[i].messages) { %>',
                                    '<div class="gtalklet_message <%=threads[i].messages[mi].type%> <%=threads[i].messages[mi].prototype%>">',
                                        '<% if(threads[i].messages[mi].showTime) {%>',
                                            '<div class="gtalklet_time"><%=threads[i].messages[mi].time%></div>',
                                        '<% } %>',
                                        '<div class="gtalklet_message_wrapper" title="<%=threads[i].messages[mi].time%>">',
                                            '<%=threads[i].messages[mi].content%>',
                                        '</div>',
                                    '</div>',
                                '<% } %>',
                                '<img src="<%=ui.path%>1.gif" class="gtalklet_loader" style="display:none"/>',
                            '</div>',
                            '<form class="gtalklet_chat_form">',
                                '<div id="thread_avatar" class="gtalklet_avatar"></div>',
                                '<textarea name="gtalklet_chat" class="gtalklet_clear" placeholder="Enter to Send" style="height: <%=threads[i].ui.messagebox.height%>px;" <% if (threads[i].ui.messagebox.disabled) { %>disabled="disabled"<% } %>><%=threads[i].ui.messagebox.typing%></textarea>',
                            '</form>',
                            '<div class="gtalklet_chat_form_mask" <% if (!threads[i].ui.messagebox.disabled) { %> style="display:none"<% } %>></div>',
                        '</div>',
                    '</div>',
                '</div>',
            '<% } %>',
        '<% } %>',

        // ?
        '<div id="gtalklet_console" class="gtalklet_panel <% if (ui.pendingThreads.length > 0) { %>unread<% } %>">',
            '<div class="gtalklet_title_bar">',
                '<div class="gtalklet_icon_button gtalklet_new_message" data-pending-thread-ids="<%=ui.pendingThreads%>" <% if (ui.pendingThreads.length === 0) { %>style="display:none"<% } %>>',
                    '<div class="gtalklet_badge"><%=ui.pendingThreads.length%></div>',
                '</div>',
                '<div class="gtalklet_icon_button gtalklet_my_presence" <% if (ui.pendingThreads.length !== 0) { %>style="display:none"<% } %>>',
                    '<div class="gtalklet_presence <%=user.presence.type%>" title="<%=user.jid%> <%=user.presence.message%>"  data-switch-class="<%=user.presence.type%>"></div>',
                    '<div class="gtalklet_jump_list <%=ui.console.state %>" data-switch-class="<%=ui.console.state%>">',
                        '<div title="Preferences" class="gtalklet_jump_list_item gtalklet_icon_button gtalklet_options"></div>',
                        '<div title="User Profile" class="gtalklet_jump_list_item gtalklet_icon_button gtalklet_profile"></div>',                        
                        '<% for(i in ui.console.commands) { %>',
                            '<div class="gtalklet_jump_list_item gtalklet_icon_button gtalklet_presence <%=ui.console.commands[i].classes%>" title="<%=ui.console.commands[i].title%>" data-presence="<%=ui.console.commands[i].classes%>"></div>',
                        '<% } %>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',

        // 
        '<div id="gtalklet_prototype" style="display:none">',
            '<div class="gtalklet_contact prototype" data-jid="">',
                '<div class="gtalklet_contact_wrapper">',
                    '<div class="gtalklet_avatar"></div>',
                    '<div class="gtalklet_presence" data-switch-class=""></div>',
                    '<div class="gtalklet_contact_name"></div>',
                    '<div class="gtalklet_contact_gateway"></div>',                    
                    '<div class="gtalklet_contact_jid"></div>',
                '</div>',
            '</div>',
        '</div>',
    '</div>',
'</script>'
].join('');

var $ = null,
    $window = null, 
    $layer = null,
    selectors = {
        openFilterButton : '#gtalklet_operation .gtalklet_toggle_filter',
        filterPanel : '#gtalklet_filter_panel',
        filter : '#gtalklet_filter_panel input.gtalklet_filter',

        contact : '#gtalklet_filter_panel .gtalklet_contact',
        contactName : '#gtalklet_filter_panel .gtalklet_contact_name', 
        contactJid : '#gtalklet_filter_panel .gtalklet_contact_jid', 

        console: '#gtalklet_console',
        newMessage: '#gtalklet_console .gtalklet_new_message',
        presence: '#gtalklet_console .gtalklet_jump_list .gtalklet_presence',
        myPresence: '#gtalklet_console .gtalklet_my_presence',
        options:'#gtalklet_console .gtalklet_options',
        profile:'#gtalklet_console .gtalklet_profile',
        

        thread: '.gtalklet_thread',
        titleBar : '.gtalklet_thread .gtalklet_title_bar',
        openAudio: '.gtalklet_open_audio',
        openVideo: '.gtalklet_open_video',
        openVCard: '.gtalklet_thread .gtalklet_title_bar .gtalklet_contact_vcard',        
        close: '.gtalklet_close_thread',        
        timeline : '.gtalklet_timeline',
        chatForm : '.gtalklet_chat_form',
        chatTextarea : 'form.gtalklet_chat_form textarea[name=gtalklet_chat]',

        sensitive: '#gtalklet_operation, #gtalklet_filter_panel, #gtalklet_console, .gtalklet_thread, .gtalklet_jump_list'
    },
    maxThread = 999,

init = function(_$) {
    $ = _$;
    $window = $(window);
},

/**
 * boss?state?
 */
handleStateChange = function(stateChange) 
{
    if (action[stateChange.report] && action[stateChange.report].callback) {
        action[stateChange.report].callback(stateChange.returns);
    }
},

/**
 * ?stateui
 */
build = function(state, effect) {
    var $body = $('body');
    // ?
    if ($('#gtalklet_template').length === 0) {
        $body.append(_template);
    }
    // gtalkletgtalklet?
    if ($('#gtalklet_layer').length === 0) {
        $body.append('<div id="gtalklet_layer" style="display:none"></div>');
    }
    // html
    $('#gtalklet_layer').replaceWith(_render(state));
    
    // ?$layer
    $layer = $('#gtalklet_layer');

    // content_scriptcss?
    if ($layer.css('position') !== 'fixed') {
        var url = chrome.extension.getURL('css/style.css');
	    $("<link rel='stylesheet' type='text/css' href='" + url + "' />").appendTo(body); 
    }

    // , js?
    _prepare();

    // zoom
    action.zoom.run();

    // ?
    action.maxThread.run();

    // 
    if (effect) {
        $('#gtalklet_layer').css('bottom', '-500px').animate({bottom:'0px'}, 'fast', function() {
            $(this).removeAttr('style');
        });
    }
},

/**
 *
 */
destroy = function(effect) {
    if (effect) {
        $layer.animate({bottom:'-500px'},'slow', function() {
            $(this).remove();
        });
    } else {
        $layer.remove();
    }
},

/**
 * , js?
 */
_prepare = function(block) {
    // url?
    $(selectors.timeline).autoLink({'class': 'gtalklet_message_link'});

    // ?
    var $contactName = $(selectors.contactName);
    var $contactJid = $(selectors.contactJid);
    var segment = $(selectors.filter).val();
    action.highlightMatches.run($contactName.add($contactJid), segment);

    // 
    action.info.run();

    // UI
    action.block.run();

    // 
    action.bindScrollToProperPosition.delegate();

    // 
    _bindOperations();
},

/**
 * 
 */
_bindOperations = function() {

    $(window).resize(function(event) {
        // zoom
        action.zoom.run();
        // ?
        action.maxThread.run(1, true);
    });

    action.prepareAutoResize.run($(selectors.thread));

    // timeline? | ?
    $layer.delegate(selectors.timeline, 'click', function() {
        if ($(this).data('moved') === 0) {
            $(this).trigger('REAL_CLICK');
        }
        $(this).data('moved', 0);
    });
    $layer.delegate(selectors.timeline, 'mousedown', function(event) {
        $(this).data('down', 1).data('x', event.pageX).data('y', event.pageY);
    });
    $layer.delegate(selectors.timeline, 'mouseup', function(event) {
        $(this).data('down', 0).data('x', null).data('y', null);
    });
    $layer.delegate(selectors.timeline, 'mousemove', function(event) {
        if ($(this).data('down') == 1) {
            if (event.pageX - parseInt($(this).data('x')) > 1 || event.pageY - parseInt($(this).data('y')) > 1) {
                $(this).data('moved', 1);
            }
        }
    });
    $layer.delegate(selectors.timeline, 'REAL_CLICK', function() {
        var $textarea = $('textarea[name=gtalklet_chat]', $(this).closest('div.gtalklet_thread'));
        if ($textarea.is(':focus')) {
            $textarea.blur();
        } else {
            $textarea.focus();
            $textarea.get(0).setSelectionRange(999,999);
        }
    });
    $layer.delegate(selectors.chatTextarea, 'focus', function() {
        var $thread = $(this).closest('div.gtalklet_thread');
        $(selectors.chatTextarea).not(this).blur();
        action.read.run($thread.attr('data-thread-id'));
    });

    // 
    $layer.delegate(selectors.chatTextarea, 'keydown', function(event) {
        if (event.which == 13) {
            if (event.ctrlKey) {
                $(this).val($(this).val() + '\n');
            } else {
                $(this).closest('form.gtalklet_chat_form').submit();
                event.preventDefault();
            }
        }
    });
    
    // ?
    $layer.delegate(selectors.options, 'click', function() {
        follower.report('showExtensionOption');
    });

    $layer.delegate(selectors.profile, 'click', function() {
        follower.report('showProfile');
    });
    
    // ?
    $layer.delegate('#gtalklet_info .gtalklet_retry', 'click', function(){
        follower.report('signin'); // signedin
    });

    // 
    $layer.delegate(selectors.presence + '.signin', 'click', function() {
        follower.report('signin'); // signedin
    });
    		    
    // action
    for (index in action) {
        if (action[index].delegate) {
            action[index].delegate();
        }
    }
},


/**
 * 
 */
_render = function(state) {
    if ($.isEmptyObject(state)) {
        return '';
    } else {
        return tmpl('gtalklet_template', state);
    }
},

action = {
    signout: {
        selector: selectors.presence + '.signout',
        event: 'click',

        run: function() {
            var base = this;

	    Boxy.confirm("<img src='" + chrome.extension.getURL("icon48.gif") + "'/>Sign out?", function() 
	    {
                follower.report('signout', {}, function(stateChange) {
                    base.callback(stateChange.returns);
                });
	    });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                base.run();
            });
        },
        callback: function(returns) {
            if (returns.signout && returns.defaultState) {
                assistant.destroy();
                assistant.build(returns.defaultState);
            }
        }
    },
    // ?
    toggleConsole: {
        selector: selectors.myPresence + ' .gtalklet_presence:not(.gtalklet_options):not(.gtalklet_profile)',
        event: 'click',

        run: function(expand) {
            var base = this;
            follower.report('toggleConsole', {expand: expand}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                base.run();
            });
        },
        callback: function(returns) {
            // returns.newState 
            var $jumpList = $('#gtalklet_console .gtalklet_jump_list');

            $jumpList.switchToClass(returns.newState);
        }
    },
    // ?
    toggleConsoleCommands: {
        run: function(commands) {
            commands = commands || [];
            var $jumpList = $(selectors.console + ' .gtalklet_jump_list').empty();
            var fragment = document.createDocumentFragment();

            fragment.appendChild($('<div title="Preferences" class="gtalklet_jump_list_item gtalklet_icon_button gtalklet_options"></div>').get(0));
            fragment.appendChild($('<div title="User Profile" class="gtalklet_jump_list_item gtalklet_icon_button gtalklet_profile"></div>').get(0));

            for (index in commands) 
            {
                var $command = $('<div class="gtalklet_jump_list_item gtalklet_icon_button gtalklet_presence"></div>');
                $command.addClass(commands[index].classes).attr('data-presence', commands[index].classes).attr('title', commands[index].title);
                fragment.appendChild($command.get(0));
            }
            
            $jumpList.append($(fragment));
        }
    },
    // 
    changePresence: {
        selector: selectors.presence + ':not(.signin):not(.signout)',
        event: 'click',

        run: function(type, message) {
            type = type || '';
            message = message || '';
            var base = this;
            follower.report('changePresence', {show: type, status: message}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                var presence = $(this).data('presence'); 
                base.run(presence, '');
            });
        },
        callback: function(returns) {
            // returns.jid
            // returns.presence
            var $presence = $(selectors.myPresence + ' > .gtalklet_presence');
            $presence.switchToClass(returns.presence.type).attr('title', returns.jid + ' ' + returns.presence.message);
        }
    },
    // /
    togglePanel: {
        selector: selectors.titleBar,
        event: 'click',

        run: function(panelId, expand) {
            panelId = panelId || '';
            var base = this;
            follower.report('togglePanel', {panelId: panelId, expand: expand}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                var $panel = $(this).parent();
                var threadId = $panel.attr('data-thread-id');
                action.read.run(threadId);
                base.run(threadId, undefined);
            }).delegate(this.selector, 'mousedown', function(event) {
                event.preventDefault();
            });
        },
        callback: function(returns) {
            // returns.panelId; panelId
            // returns.newState; pannel?
            var panelId = returns.panelId;
            var newState = returns.newState;
            var $panel = $('div[data-thread-id="' + panelId + '"]');

            $panel.switchToClass(newState);

            action.bindScrollToProperPosition.callback($panel.find('.gtalklet_scroll'));

            if (returns.newState == 'normal') {
                var $textarea = $('textarea[name=gtalklet_chat]', $panel);
                if (!$textarea.not('[disabled]').is(':focus')) {
                    $textarea.focus();
                }
            }
        }
    },
    // 
    showMessages: {
        run: function(threadId, messages, unread, removeOldest) {
            threadId = threadId || '';
            messages = messages || [];
            unread = unread || false;
            removeOldest = removeOldest || false;
            
            var $panel = $('div[data-thread-id="' + threadId + '"]');
            var $timeline = $('.gtalklet_timeline', $panel);

            var prototype = $('.gtalklet_message.prototype', $timeline).clone().removeClass('prototype');
            
            var fragment = document.createDocumentFragment();
            for (index in messages) {
                var $newMessage = prototype.clone().addClass(messages[index].type).find('.gtalklet_message_wrapper').attr('title', messages[index].time).html(messages[index].content).end(); // html() safe, background encoded

                if (messages[index].showTime) {
                    $newMessage.find('.gtalklet_time').text(messages[index].time);
                }

                fragment.appendChild($newMessage.autoLink({'class': 'gtalklet_message_link'}).show().get(0));
            }
            $timeline.append($(fragment));

            if (removeOldest) {
                $('.gtalklet_message:not(.prototype)', $timeline).first().remove();
            }

            // ?
            if (unread) {
                if ($('textarea[name=gtalklet_chat]', $panel).is(':focus')) {
                    action.read.run($panel.attr('data-thread-id'));
                } else {
                    $panel.addClass(unread);
                }
            }

            // timeline
            $timeline.scrollTop(9999);
        }
    },
    // /filter
    toggleFilterPanel: {
        selector: selectors.openFilterButton,
        event: 'click',

        selector2: selectors.filter,
        event2: 'blur',

        run: function(expand) {
            var base = this;
            
            if (typeof(expand) === 'undefined' || !expand) action.filter.run(" ");
            
            follower.report('toggleFilterPanel', {expand: expand}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                base.run();
            });
            $layer.delegate(this.selector2, this.event2, function() {
                if (false && $(this).val() === '') {
                    base.run(false);
                }
            });
        },
        callback: function(returns) {
            // returns.newState 
            var newState = returns.newState;

            var $filterPanel = $(selectors.filterPanel);
            var $openFilterButton = $(this.selector);
            var $filter = $(this.selector2);

            $filterPanel.switchToClass(newState);

            if ($filter.is(':visible')) {
                $filter.focus();
                $openFilterButton.switchToClass('close');
            } else {
                $filter.val('').trigger('REFRESH_FILTER');
                $openFilterButton.switchToClass('open');
            }
        }
    },
    filter : {
        selector: selectors.filter,
        event: 'keyup REFRESH_FILTER',
        
        run: function(segment) {
            segment = segment || '';
            var base = this;
            follower.report('filter', {segment: segment}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            var $filterPanel = $(selectors.filterPanel);
            $layer.delegate(this.selector, this.event, function(event) {
                if ($.inArray(event.which, [27,37,38,39,40]) != -1) {
                    event.stopPropagation();
                } else {
                    var segment = $(this).val();
                    base.run(segment);
                }
                
            }).delegate(selectors.filter, 'keydown', function(event) {
                if (event.which == 13) { 
                    // 
                    var $currentMatchedContacts = $('.gtalklet_contact.current', $filterPanel);
                    $currentMatchedContacts.eq(0).click();
                } else if (event.which == 38 || event.which == 40) { 
                    // 
                    var $matchedContacts = $('.gtalklet_contact', $filterPanel);
                    var $current = $matchedContacts.filter('.current');
        
                    var method = event.which == 38 ? 'prev' : 'next';
        
                    var $target = null;
                    if ($current.length === 0) {
                        // 
                        $target = $matchedContacts.last();
                        $target.addClass('current');
                    } else if ($current.length === 1) {
                        // ?
                        $current.removeClass('current');
                        $target = $current.eq(0)[method](':not(.prototype)'); 
                        $target.addClass('current');
                    }
        
                    event.stopPropagation();
                    event.preventDefault();
                } else if (event.which == 27) {
                    // escape
                    action.toggleFilterPanel.run(false);
                }
            }).delegate(selectors.contact, 'hover', function(event) {
                $(selectors.contact).removeClass('current');
                $(this).addClass('current');
            });
        },
        callback: function(returns) {
       
            // returns.segment
            // returns.matchedContacts;
            // returns.matchedContactsSum;
            var segment = returns.segment;
            var matchedContacts = returns.matchedContacts;
            var matchedContactsSum = returns.matchedContactsSum;

            $(this.selector).val(segment).removeClass('invalid').removeClass('invited').removeAttr('title');

            var $contactsTimeline = $('#gtalklet_filter_panel .gtalklet_contacts');
            
            if (matchedContacts.length > 0) {
                $('.gtalklet_contact, .gtalklet_message:not(.prototype)', $contactsTimeline).remove();
                var fragment = document.createDocumentFragment();
                var more = matchedContactsSum - matchedContacts.length;
                
                if (more > 0) {
                    fragment.appendChild($('<div class="gtalklet_message">' + more + ' more...</div>').get(0));
                }
                for (index in matchedContacts) {
                    var jid = matchedContacts[index].jid;
                    var name = matchedContacts[index].name;
                    var gateway = matchedContacts[index].gateway;

                    var presenceType = matchedContacts[index].presence.type;
                    var presenceMessage = matchedContacts[index].presence.message == "" ? "&nbsp;" : matchedContacts[index].presence.message;
                    var $contact = $('.gtalklet_contact.prototype').clone().removeClass('prototype').attr('data-jid', jid).find('.gtalklet_presence').switchToClass(presenceType).attr('title', presenceMessage).end();
                    var $contactJid = $('.gtalklet_contact_jid', $contact).html(presenceMessage);

                    var $contactName = $('.gtalklet_contact_name', $contact).html(name);
                    
                    var avatarImage = '<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD26p7K0ub2byrWF5X77RwPcntUFeg+CYok0CJozkyMzP8A72cfyAoA4vUdLv8ATz/pVuyr2ccr+YqlXquowQXFlLDcKDEyHdn09a8qFAB7V3/hDS7vTrVjczACXDCED7pwOp9exHtXOeCbbz9cSQ42wIXOfXoP55/CvQaAM/xBZXF/pkltbziJnxnI4YZ6E9hXm1xDLbzvBMhSRDhga9Zrj/iFaAG3vgef9Uw/Mj+tAH//2Q==" />'

                    if (matchedContacts[index].avatar && "data:;base64," != matchedContacts[index].avatar && "" != matchedContacts[index].avatar)
                    {
                    	avatarImage = '<img  src="' + matchedContacts[index].avatar + '"/>';
                    }
                    
                    $('.gtalklet_avatar', $contact).show().get(0).appendChild($(avatarImage).get(0));
                    $('.gtalklet_contact_gateway', $contact).html(gateway);
                        
                    fragment.appendChild($contact.show().get(0)); 
                    
                     
                    action.highlightMatches.run($contactName.add($contactJid), segment);
                }

                $contactsTimeline.append($(fragment));

                if (matchedContacts.length == 1) {
                    $contact.addClass('current');
                }

                $('.gtalklet_invite').hide();
            } else {
                var emptyMessage = '';
                if (segment === '') {
                    emptyMessage = 'Search all contacts';
                    $('.gtalklet_invite').hide();
                } else {
                    emptyMessage = 'No matching contacts';
                    $('.gtalklet_invite').removeClass('invited').attr('title', 'Invite to chat').show();
                }
                    
                var $emptyMessage = $('.gtalklet_message.prototype', $contactsTimeline).clone().removeClass('prototype').text(emptyMessage);
                    
                $('.gtalklet_contact, .gtalklet_message:not(.prototype)', $contactsTimeline).remove();
                $contactsTimeline.append($emptyMessage);
            }
        }
    },
    // / 
    createThread: {
        selector: selectors.filterPanel + ' .gtalklet_contact',
        event: 'click',

        run: function(jid) {
            jid = jid || '';
            var base = this;
            follower.report('createThread', {jid: jid}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                var jid = $(this).attr('data-jid');
                var $existedThreads = $(selectors.thread + '[data-jid=' + jid + ']');

                if ($existedThreads.length > 0) {
                    action.toggleFilterPanel.run(false);
                    action.activatePanel.run($existedThreads.eq(0), true);
                } else {
                    base.run(jid);
                }
            });
        },
        callback: function(returns) {
            // returns.createdThread
            var thread = returns.createdThread;
            action.createPanel.run(thread, true);
            
	    if (thread.chatType == "groupchat")
	    {
		follower.report('getRoomJids', {jid: returns.jid, threadId: thread.id});	  
	    }
        }
    },

    returnRoomJids: {
    
  	callback: function(returns) {
            // returns.jid
            
            _invitedMUCJids[returns.jid] = returns;  
            _activeMUCJids[returns.jid] = [];
        }        
    }, 

    closeThread: {
        selector: selectors.close,
        event: 'click',

        run: function(threadId) {
            threadId = threadId || '';
            var base = this;
            follower.report('closeThread', {threadId: threadId}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function(event) {
                var threadId = $(this).closest(selectors.thread).attr('data-thread-id');
                base.run(threadId);
                event.stopPropagation();
            });
        },
        callback: function(returns) {
            // returns.threadId, thread
            var threadId = returns.threadId;
            var $thread = $('.gtalklet_thread[data-thread-id=' + threadId + ']');
            $thread.remove();

	    console.log("closeThread " + returns.thread.user.jid);	
		
	    if (returns.thread.chatType == "groupchat")
	    {
		    var jids = _activeMUCJids[returns.thread.user.jid];
		    
		    for (jid in jids)
		    {
			console.log("closeThread MUC " + jids[jid]);

			if (jids[jid] != _myName)
			{	    
			    this.closeWindow(jids[jid]);	

			} else {

			    this.closeMyWindow();
			}
		    }	    
	    
	    } else {

		console.log("closeThread chat " + returns.thread.user.jid);	    
		
		var jid = returns.thread.user.jid + "/ofchat";
		this.closeWindow(jid);		    
	    }
        },
        
        closeWindow: function(jid) {
	    console.log("closeWindow " + jid);	
	    
	    var data = _jingleRequests[jid];
	    
	    if (data != null)
	    {
		var call = _jingleCalls[data.id];
		
		call.hangup();

		if (call._videoPanel != null) 
		{   
			call._videoPanel.unload();  
			call._videoPanel = null;	    
		}
		
	    	_jingleCalls[data.id] = null; 		    
	    }

	    _jingleRequests[jid] = null;       
        },
        
        closeMyWindow: function() {   
	    console.log("closeMyWindow");	

	    if (_myVideoPanel != null) 
	    {   
		_myVideoPanel.unload();  
		_myVideoPanel = null;	    
	    }	          
        }
    },
      
    doWebRTC: {

    	doMakeCall: function(callType, threadId, jid, chatType, name) 
    	{
 		console.log("doMakeCall " + callType.video + " " + jid);
 		var base = this;
 		
 		base.callType = callType;
 		base.threadId = threadId;
 		base.jid = jid;
 		base.chatType = chatType;
 		base.name = name;

		if (typeof(navigator.webkitGetUserMedia) != 'undefined') 
		{ 		
			navigator.webkitGetUserMedia(callType,  

				function(stream) 
				{
				    var url = webkitURL.createObjectURL(stream);  

				    console.log("doMakeCall " + base.callType);     

				    base.localVideoStream = stream;
				    base.startCall(base.callType, base.threadId, base.jid, base.chatType, base.name);
				},

				function(error) 
				{
					Boxy.alert("<img src='" + chrome.extension.getURL("icon48.gif") + "'/>Media Stream Error " + error);
				}); 
				
		} else {

		    Boxy.alert("<h2>WebRTC (webkitGetUserMedia) is not enabled or supported!!!</h2>");		
		}				
	},
    
    	startCall: function(callType, threadId, jid, chatType, name) {

		if (typeof(webkitPeerConnection00) != 'undefined') 
		{
		    console.log("openVideo run " + chatType);

		    threadId = threadId || '';
		    var now = new Date();                  	
		    var time = now.toLocaleTimeString();
		    var timestamp = now.getTime();  

		    if (chatType == "groupchat")
		    {
			this.doJingle(callType,  _invitedMUCJids[jid]);

		    } else {
			var sessionId = "webrtc" + Math.random().toString(36).substr(2,9);
			var jingleCall = new JingleCall(callType, this.localVideoStream, sessionId, Direction.OUTBOUND);
			_jingleCalls[sessionId] = jingleCall;		    

			jingleCall.name = name;	
			jingleCall.chatType = "chat";
			jingleCall.initiator = _myJid;
			jingleCall.remoteJid = jid + "/ofchat";
			jingleCall.state = CallState.INITIAL;
			jingleCall.threadId = threadId;
			jingleCall.start();

			var message = {type: 'chat_recieved', from: jingleCall.remoteJid, time: time, timestamp: timestamp, content: "<font color='blue'>Close this panel to terminate call</font>"}
			action.showMessages.run(threadId, [message]);
		    }
		    
		} else {

		    Boxy.alert("<h2>WebRTC (webkitPeerConnection00) is not enabled or supported!!!</h2>");		
		}  	
    	},
    
  	doJingle: function(callType, returns) {
            // returns.nicks, jid, threadId

	    var localVideoUrl = webkitURL.createObjectURL(this.localVideoStream);
			
	    for (nickname in returns.nicks)
	    {
		console.log("doJingle " + returns.nicks[nickname]);
	    
	        if (returns.nicks[nickname] != _myName)
	        {
			var sessionId = "webrtc" + Math.random().toString(36).substr(2,9);
			var jingleCall = new JingleCall(callType, this.localVideoStream, sessionId, Direction.OUTBOUND);
			_jingleCalls[sessionId] = jingleCall;		    

			jingleCall.chatType = "groupchat";
			jingleCall.initiator = _myJid;	
			jingleCall.remoteJid = returns.jid + "/" + returns.nicks[nickname];
			jingleCall.state = CallState.INITIAL;
			jingleCall.threadId = returns.threadId;
			jingleCall.start()
			
		    	var now = new Date();                  	
		    	var time = now.toLocaleTimeString();
		    	var timestamp = now.getTime();  
			var message = {type: 'chat_recieved', from: jingleCall.remoteJid, time: time, timestamp: timestamp, content: "<font color='blue'>Jingle Group Call: " + returns.nicks[nickname] + "</font>"}
			action.showMessages.run(returns.threadId, [message]);
			
			_activeMUCJids[returns.jid].push(jingleCall.remoteJid);

		} else {

			var content = "<video width=320 height=240 src='" + localVideoUrl + "' autoplay='autoplay' />";	
			
			if (this._myVideoPanel != null) this._myVideoPanel.remove(); 

			if (callType.video == true)
			{
				_myVideoPanel = new Boxy(content, {
					title: _myName, 
					show: true, 
					x: 10,
					y: 10,
					draggable: true, 
					unloadOnHide: true,
					beforeUnload: this.onUnload
				});
				
			} else {

				_myVideoPanel = jQuery(content).css('display', 'none').appendTo(document.body);   	
			}				
			
		}
	    }
        },
        
        onUnload: function() {
        
        	console.log("Closing local video");
        	_myVideoPanel = null;
        } 
    },

    openAudio: {
	selector: selectors.openAudio,
	event: 'click',    
	
	run: function(threadId, jid, chatType, name) {	

		action.doWebRTC.doMakeCall({audio:true, video:false}, threadId, jid, chatType, name);
        },
        
        delegate: function() {
            var base = this;
            
            $layer.delegate(this.selector, this.event, function(event) {                
                var $thread = $(this).closest('div.gtalklet_thread');
                var threadId = $thread.attr('data-thread-id');
                var jid = $thread.attr('data-jid');
		var name = $thread.find('.gtalklet_contact_name').text();
                var chatType = $thread.attr('data-chatType');
                
                base.run(threadId, jid, chatType, name);
                event.stopPropagation();
            });
        },
    },
 
 
    openVideo: {
	selector: selectors.openVideo,
	event: 'click',

	run: function(threadId, jid, chatType, name) {
		
		action.doWebRTC.doMakeCall({audio:true, video:true}, threadId, jid, chatType, name);
        },
        
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function(event) {                
                var $thread = $(this).closest('div.gtalklet_thread');
                var threadId = $thread.attr('data-thread-id');
                var jid = $thread.attr('data-jid');
		var name = $thread.find('.gtalklet_contact_name').text();
                var chatType = $thread.attr('data-chatType');
                
                base.run(threadId, jid, chatType, name);
                event.stopPropagation();
            });
        },              
    },
                   
    jingleEvent: {
    
    	callback: function(data) 
    	{
	     console.log("handleJingle");
	     console.log(data);

	     var call = null;
	      _jingleRequests[data.from] = data;	     

	     switch(data.jingleRequest) 
	     {
		 case "session-initiate":
	    
		    var message = '<h1>' + (data.media.audio ? 'Audio ' : '')  + (data.media.video ? 'Video ' : '')  + ' request from ' + data.from + '</h1>'

		    Boxy.ask(message, ['Accept', 'Reject'], function(response) 
		    {
			if (response == 'Accept')
			{
				action.acceptVideo.run(data.from, data.media);
			}
			
			if (response == 'Reject')
			{
				action.rejectVideo.run(data.from, data.media);
			}			
			
		    });
		    
		    break;


		 case "session-accept":	// Accepted Outbound Call
		    
		    var call = _jingleCalls[data.id] || null;	     	 
		    
		    if (call != null)
		    {
			    call.state = CallState.CONNECTED;
			    call.processSDP(data.sdp);
		    
		    }
		    break;

		 case "session-terminate":

		    var call = _jingleCalls[data.id] || null;	

		    if (call != null)
		    {	
		    	    call.hangup();
		    	    
			    call.state = CallState.DISCONNECTED;

			    if (call._videoPanel != null) 
			    {
				call._videoPanel.unload();  
				call._videoPanel = null;
			    }
		    }
		    
		    break;


		 case "session-info":

		    var call = _jingleCalls[data.id] || null;	
		    
		    if (call != null)
		    {		    
		    	call.state = CallState.RINGING;
		    }
		    
		    break;
	     }

	     console.log("handleJingle send reply " + data.jingleRequest + " " + data.id);

	     // Send Reply

	     if (call != null) call.sendACK(data.id);     

        }        
    },
    
    openVCard: {
        selector: selectors.openVCard,
        event: 'click',

        run: function(threadId) {
            threadId = threadId || '';
            var base = this;
            follower.report('openVCard', {threadId: threadId}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function(event) {
                var threadId = $(this).closest(selectors.thread).attr('data-thread-id');
                base.run(threadId);
                event.stopPropagation();
            });
        },
        callback: function(returns) {
            // returns.threadId
            var threadId = returns.threadId;

        }
    },
    
    // 
    createPanel: {
        run: function(thread, collapseFilterPanel) {
            thread = thread || [];
            collapseFilterPanel = collapseFilterPanel || false;
            var threadId = thread.id;
            var jid = thread.user.jid;
            var chatType = thread.chatType || "chat";
            
            var avatarImage = '<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD26p7K0ub2byrWF5X77RwPcntUFeg+CYok0CJozkyMzP8A72cfyAoA4vUdLv8ATz/pVuyr2ccr+YqlXquowQXFlLDcKDEyHdn09a8qFAB7V3/hDS7vTrVjczACXDCED7pwOp9exHtXOeCbbz9cSQ42wIXOfXoP55/CvQaAM/xBZXF/pkltbziJnxnI4YZ6E9hXm1xDLbzvBMhSRDhga9Zrj/iFaAG3vgef9Uw/Mj+tAH//2Q==" />'

	    if (thread.user.avatar && "data:;base64," != thread.user.avatar && "" != thread.user.avatar)
	    {
		var avatarImage = '<img src="' + thread.user.avatar + '"/>';
	    }

            var presenceType = thread.user.presence.type;
            var presenceMessage = thread.user.presence.message;
            
            var $createdThread = $('.gtalklet_thread.prototype').clone().removeClass('prototype').attr('data-thread-id', threadId).attr('data-jid', jid).attr('data-chatType', chatType);
            
            $('.gtalklet_title_bar', $createdThread).find('.gtalklet_presence').addClass(presenceType).attr('data-switch-class', presenceType).attr('title', presenceMessage).end().find('.gtalklet_contact_name').html("<div class='gtalklet_contact_vcard'>" + thread.user.name + "</div>").attr('title', unescape(thread.user.jid));  
            
            $('#thread_avatar', $createdThread).show().get(0).appendChild($(avatarImage).get(0))
            
            if (thread.ui.messagebox.disabled) {
                $(selectors.chatTextarea, $createdThread).attr('disabled', 'disabled');
                $('.gtalklet_chat_form_mask', $createdThread).show();
            }
            
            // 
            action.scrollPanel.delegate($createdThread);

            // ?
            if (collapseFilterPanel) {
                action.toggleFilterPanel.run(false);
                // 
                $createdThread.insertAfter($(selectors.filterPanel));
            } else {
                var $console = $(selectors.console);
                $createdThread.insertBefore($console);
            }
            action.activatePanel.run($createdThread, false);

            // autoRezie
            action.prepareAutoResize.run($createdThread);

            // messagesprototype, ?message
            if (thread.messages && thread.messages.length > 1) {
                action.showMessages.run(threadId, thread.messages);
            }
            action.maxThread.run();
        }
    },
    // 
    activatePanel: {
        run: function($panel, acceptThread) {
            acceptThread = acceptThread || false;
            
            var threadId = $panel.attr('data-thread-id');
            action.togglePanel.run(threadId, true);

            if (acceptThread) {
                var pendingThreadIds = $(selectors.newMessage).attr('data-pending-thread-ids');
                var index = pendingThreadIds.indexOf(threadId);
                if (index !== -1) {
                    action.acceptThread.run(threadId);
                }
            }
        }
    },
    // ?
    acceptThread: {
        selector: selectors.newMessage,
        event: 'click',

        run: function(threadId) {
            threadId = threadId || '';
            var base = this;
            follower.report('acceptThread', {threadId: threadId}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                var threadId = $(this).attr('data-pending-thread-ids').split(',').shift();  //shift ?
                var pendingThreadIds = $(selectors.newMessage).attr('data-pending-thread-ids');

                var index = pendingThreadIds.indexOf(threadId);
                if (index !== -1) {
                    //threadIds.splice(index, 1);
                    base.run(threadId);
                }
            });
        },
        callback: function(returns) {
            // returns.createdThread;
            var thread = returns.createdThread;
            var threadId = thread.id;
            var $newMessage = $(selectors.newMessage);
            var $badge = $('.gtalklet_badge', $newMessage);
            
            if (thread) {
                action.createPanel.run(thread, false);
            }

            var pendingThreadIds = $(selectors.newMessage).attr('data-pending-thread-ids');
            var threadIds = pendingThreadIds.split(',');
            var index = threadIds.indexOf(threadId);
            if (index !== -1) {
                threadIds.splice(index, 1);
                $newMessage.attr('data-pending-thread-ids', threadIds.toString());
            }

            var num = parseInt($badge.text());
            if (num > 1) {
                $badge.text(num - 1);
            } else {
                $badge.text('0');
                $(selectors.console).removeClass('unread');
                $newMessage.hide();
                $(selectors.myPresence).show();
            }
        }
    },
    // ?
    typing: {
        selector: selectors.chatTextarea,
        event: 'keyup',

        run: function(content, threadId) {
            content = content || '';
            threadId = threadId || '';
            follower.report('typing', {content: content, threadId: threadId}, function(stateChange) {
                // pass;
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                var content = $(this).val();
                var threadId = $(this).closest('div.gtalklet_thread').attr('data-thread-id');
                base.run(content, threadId);
            });
        },
        callback: function(returns) {
            // returns.threadId;
            // returns.content;
            var threadId = returns.threadId;
            var content = returns.content;

            var $textarea = $(selectors.thread + '[data-thread-id=' + threadId + '] textarea[name=gtalklet_chat]');
            $textarea.val(content);
        }
    },
    // 
    send: {
        selector: selectors.chatForm,
        event: 'submit',

        run: function(message, jid, threadId) {
            if (message && jid && threadId && message.match(/\S+/)) {
                var base = this;
                follower.report('send', {message: message, jid: jid, threadId: threadId}, function(stateChange) {
                    base.callback(stateChange.returns);
                });
            };
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function(event) {
                var $thread = $(this).closest('div.gtalklet_thread');
                var threadId = $thread.attr('data-thread-id');
                var $textarea = $('.gtalklet_thread[data-thread-id="' + threadId + '"] textarea[name=gtalklet_chat]'); 
                var message = $textarea.val();
                var jid = $thread.attr('data-jid');
                base.run(message, jid, threadId);
                event.preventDefault();
            });
        },
        callback: function(returns) {
            // returns.threadId; threadId
            // returns.removeOldest;
            // returns.message;
            var message = returns.message;
            var threadId = returns.threadId;
            var removeOldest = returns.removeOldest;

            var $textarea = $('.gtalklet_thread[data-thread-id="' + threadId + '"] textarea[name=gtalklet_chat]'); 
            $textarea.val('');
            action.showMessages.run(threadId, [message], false, removeOldest);
        }
    },
    // ? 
    read: {
        selector: selectors.thread,
        
        run: function(threadId) {
            threadId = threadId || '';
            var base = this;
            follower.report('read', {threadId: threadId}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        callback: function(returns) {
            // returns.threadId;
            var threadId = returns.threadId;
            var $thread = $(this.selector + '[data-thread-id=' + threadId + ']');
            $thread.removeClass('unread');
        }
    },
    // thread
    scrollPanel: {
        selector: '.gtalklet_timeline',
        event: 'scroll',

        run: function(threadId, scrollTop) {
            threadId = threadId || '';
            scrollTop = scrollTop || 0;
            
            follower.report('scrollPanel', {threadId: threadId, scrollTop: scrollTop}, function(stateChange) {
                var $panel = $(selectors.thread + '[data-thread-id=' + threadId + ']');
                var $timeline = $(this.selector, $panel);
                $timeline.attr('data-scroll', scrollTop);
            });
        },
        delegate: function($thread) {
            var base = this;
            var element = this.selector;
            if ($thread) {
                element = $thread.find(this.selector);
            }
            $(element).bind(this.event, function() {
                if (document.webkitVisibilityState == 'visible' && $layer.css('visibility') !== 'hidden') {
                    // $layer?visibility?Mac
                    var threadId = $(this).closest(selectors.thread).attr('data-thread-id');
                    var scrollTop = $(this).attr('scrollTop');
                    base.run(threadId, scrollTop);
                }
            });
        },
        callback: function(returns) {
            // returns.threadId;
            // returns.scrollTop;
            var threadId = returns.threadId;
            var scrollTop = returns.scrollTop;
            
            var $panel = $(selectors.thread + '[data-thread-id=' + threadId + ']');
            
            var $timeline = $(this.selector, $panel);
            $timeline.attr('data-scroll', scrollTop);
            //setTimeout(function() {
                $timeline.scrollTop(scrollTop);
            //}, '200');
        }
    },
    // info
    info: {
        run: function(message, level) {
            message = message || '';
            level = level || '';

            // infotimeout?
            if (typeof(gtalklet_info_timeout) !== 'undefined') {
                clearTimeout(gtalklet_info_timeout);
            }

            var $info = $('#gtalklet_info');
            var hiddenMessage = $info.find('div.gtalklet_info').html();
            if (!message && hiddenMessage) {
                message = hiddenMessage;
                level = $info.find('div.gtalklet_title_bar').attr('data-switch-class');
            }

            // info? ... 
            if (message && $(message).text().lastIndexOf('...') === -1) {
                var timeout = 3000;
                gtalklet_info_timeout = setTimeout(function() {
                    action.clearInfo.run();
                }, timeout);
            }

            if (message) {
                $info.find('div.gtalklet_info').html(message).end().show();
                $('.gtalklet_title_bar', $info).switchToClass(level);
            }
        }
    },
    // info
    clearInfo: {
        run: function() {
            var base = this;
            follower.report('clearInfo', {}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        callback: function(returns) {
            // no returns;
            $('#gtalklet_info').fadeOut('slow', function() {
                $('.gtalklet_info', this).empty();
            });
        }
    },
    // 
    highlightMatches: {
        run: function(element, needle) {
            var regex = new RegExp('(' + needle + ')', 'i');

            $(element).each(function(i, e) {
                var html = $(e).text().replace(regex, '<div class="gtalklet_strong">$1</div>');
                $(e).html(html);
            });
        }
    },
    // 
    maxThread: {
        run: function(diff, careful) {
            diff = diff || 1;
            careful = careful || false;
            var arbitrary = !careful;
            var pageWidth = $window.width();

            // 300 panel, 200 panel 
            var newMaxThread = Math.floor((pageWidth - 300) / 200);  
            
            if (arbitrary || newMaxThread < maxThread) {
                var $threads = $(selectors.thread).not('.prototype');
                var diff = $threads.size() - newMaxThread; 
                if (diff > 0) {
                    action.closeOldestThread.run(diff);
                }

                maxThread = newMaxThread;
            }
        }
    },
    // 
    closeOldestThread: {
        run: function(diff) {
            diff = diff || 1;
            var base = this;
            follower.report('closeOldestThread', {num: diff}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        callback: function(returns) {
            // returns.threadIds
            var threadIds = returns.threadIds;

            for (index in threadIds) {
                var $panel = $(selectors.thread + '[data-thread-id=' + threadIds[index] + ']');
                $panel.remove();
            }
        }
    },
    // autoResize
    prepareAutoResize: {
        run: function($thread) {
            return;
            // 
            //this.delegate($thread);
        },
        delegate: function($thread) {
            return;
            var $textarea = null;
            if ($thread) {
                $textarea = $('textarea[name=gtalklet_chat]', $thread);
            } else {
                $textarea = $(selectors.chatTextarea);
            }
            $textarea.each(function(index, element) {
                $(element).css('display', 'block').autoResize({
                    'extraSpace': 16,
                    'emptySpace': 16,
                    'animate': true, // animate : true, animateCallback
                    'animateCallback': function(data) {
                        follower.report('resizeTextarea',
                                        {threadId: $thread.attr('data-thread-id'), height: $(this).height()},
                                        function(report) {}
                        );
                    }
                });
            });
        },
        callback: function(returns) {
            return;
            // returns.threadId;
            // returns.height;
            var threadId = returns.threadId;
            var height = returns.height;

            var $textarea = $(selectors.thread + '[data-thread-id=' + threadId + '] textarea[name=gtalklet_chat]');
            $textarea.css('height', height);
        }
    },
    // UI / 
    block: {
        run: function(isBlock) {
            if (typeof(isBlock) === 'undefined') {
                // #gtalklet_layerblocked?blockunblock
                var blocked = $('#gtalklet_layer').data('blocked');
                if (blocked) {
                    $(selectors.sensitive).block({message: null, overlayCSS: {cursor: 'auto'}, fadeIn: 0}).find('textarea:focus').blur();
                } else {
                    $(selectors.sensitive).unblock();
                }
            } else {
                if (isBlock) {
                    $(selectors.sensitive).block({message: null, overlayCSS: {cursor: 'auto'}}).find('textarea:focus').blur();
                    $('#gtalklet_layer').attr('data-blocked', true);
                } else {
                    $(selectors.sensitive).unblock();
                    $('#gtalklet_layer').removeAttr('data-blocked');
                }
            }
        }
    },
    bindScrollToProperPosition: {
        delegate: function() {
            var base = this;
            $('img.gtalklet_loader').load(function() {
                var $scroll = $(this).closest('.gtalklet_scroll');
                base.callback($scroll);
            });
        },
        callback: function($scroll) {
            var scrollTop = $scroll.data('scroll');
            if (scrollTop) {
                setTimeout(function() {
                    $scroll.scrollTop(scrollTop);
                }, '0');
            }
        }
    },
    // 
    scrollToProperPosition: {
        run: function() {
            // no paramters
            setTimeout(function() {
                $('.gtalklet_scroll').each(function() {
                    var scrollTop = $(this).data('scroll');
                    if (scrollTop) {
                        $(this).scrollTop(scrollTop);
                    }
                });
            }, '0');
        }
    },
    // ?log
    log: {
        callback: function(returns) {
            // returns.message
            // returns.level
            var message = returns.message || '';
            var level = returns.level;

            action.info.run(message, level);
        }
    },
    dropped: {
        callback: function(returns) {
            // returns.blocked
            action.block.run(returns.blocked);
        }
    },
    connecting: {
        callback: function(returns) {
            // returns.blocked
            action.block.run(returns.blocked);
        }
    },
    // 
    connected: {
        callback: function(returns) {
            // returns.blocked
            // returns.jid
            // returns.presence
            // returns.commands
            action.block.run(returns.blocked);

            $(selectors.myPresence).find('.gtalklet_presence').switchToClass('chat').attr('title', returns.jid + ' ' + returns.presence.message);
            action.toggleConsoleCommands.run(returns.commands);

            $('#gtalklet_operation').show('slow');
            
            _myJid = returns.jid;
            _myName = _myJid.split("@")[0];
            //_getLocalMedia();
        }
    },
    connectError: {
        callback: function(returns) {
            // returns.blocked
            action.block.run(returns.blocked);
        }
    },
    // , 
    recieved: {
        callback: function(returns) {
            // returns.threadId; threadId
            // returns.message; 
            // returns.unread; 
            // returns.removeOldest
            var messages = [returns.message];
            action.showMessages.run(returns.threadId, messages, returns.unread, returns.removeOldest);
        }
    },
    // 
    recievedThread: {
        callback: function(returns) {
            // return.jid
            // returns.name
            // returns.threadId;

            var $newMessage = $(selectors.newMessage);
            var $presence = $(selectors.myPresence);
            var $console = $(selectors.console);

            var pendingIds = $newMessage.attr('data-pending-thread-ids');
            if (pendingIds === '' || typeof(pendingIds) === 'undefined') {
                pendingIds = returns.threadId;
            } else {
                pendingIds += (',' + returns.threadId);
            }

            $newMessage.attr('data-pending-thread-ids', pendingIds).show();
            $console.addClass('unread');
            var $badge = $newMessage.find('.gtalklet_badge');
            $badge.text(parseInt($badge.text(), 10) + 1);
            $presence.hide();
        }
    },
    // 
    presence: {
        callback: function(returns) {
            // returns.jid; 
            // returns.presence.type;
            // returns.presence.message;

            if (returns) {
                var $presence = $(selectors.thread + '[data-jid="' + returns.jid + '"] .gtalklet_presence');
                $presence.switchToClass(returns.presence.type).attr('title', returns.presence.message);
            }
        }
    },
    toggleHidden: {
        callback: function(returns) {
        
            if ($layer) 
            {
		    if (returns.hide) {
			$layer.css('visibility', 'hidden');
		    } else {
			$layer.css('visibility', 'visible');
		    }
	    }
        }
    },
    invite: {
        selector: '.gtalklet_invite',
        event: 'click',

        run: function() {
            var base = this;
            var jid = $(selectors.filter).val();

            follower.report('invite', {jid: jid}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                base.run();
            });
        },
        callback: function(returns) {
            // returns.invited = true|false
            // returns.invalidJid = true|false
            if (returns.invited) {
                $(this.selector).addClass('invited').attr('title', 'Invited');
            } else if (returns.invalidJid){
                // jid?
                $(selectors.filter).addClass('invalid').attr('title', 'Invalid JID: ' + returns.jid);
            } else {
                
            }
        }
    },
    
    acceptVideo: {
        selector: '.gtalklet_video_ok',
        event: 'click',

        start: function(jid) {
        
	    var data = _jingleRequests[jid];
	    var url = webkitURL.createObjectURL(this.localVideoStream);

	    call = new JingleCall(this.callType, this.localVideoStream, data.id, Direction.INBOUND);
	    _jingleCalls[data.id] = call;

	    call.name = data.name;	
	    call.chatType = data.chatType;			
	    call.remoteJid = data.from;
	    call.initiator = data.initiator;
	    call.state = CallState.PROGRESS;

	    console.log("handleJingle session-initiate " + call.remoteJid + " " + url);

	    if (call.chatType == "groupchat" && _myVideoPanel == null)
	    {	
	    	var content = "<video width=320 height=240 src='" + url + "' autoplay='autoplay' />";				

		if (call.callType.video == true)
		{ 	    
			_myVideoPanel = new Boxy(content, {
				title: _myName, 
				show: true, 
				x: 10,
				y: 10,
				draggable: true, 
				unloadOnHide: true,
				beforeUnload: this.onUnload
			});
			
		} else {

			_myVideoPanel = jQuery(content).css('display', 'none').appendTo(document.body);   	
		}

		var roomJid = jid.split("/")[0];			
		_activeMUCJids[roomJid].push(call.remoteJid);
	    }	

	    call.accept(data.sdp);	    	    		    
	
	    //$('#gtalklet_video_' + data.id).remove(); 		    

        },

    	run: function(jid, callType) 
    	{
 		console.log("acceptVideo " + callType + " " + jid);
 		var base = this;
 		
 		base.callType = callType;
 		base.jid = jid;
 		
		navigator.webkitGetUserMedia(callType,  
		
			function(stream) 
			{			
			    console.log("doMakeCall " + base.callType);     
				
			    base.localVideoStream = stream;
			    base.start(base.jid);
			},

			function(error) 
			{

				Boxy.alert("<img src='" + chrome.extension.getURL("icon48.gif") + "'/>Media Stream Error " + error);
			}); 
	},
        
        delegate: function() {
            var base = this;              
            $layer.delegate(this.selector, this.event, function() {          
               	var jid = $(this).attr('data-jid');
	        var data = _jingleRequests[jid];
               	
                base.run(jid, data.media);                    
            });
        },
        
        onUnload: function() {
        
        	console.log("Closing local video");
        	_myVideoPanel = null;
        }        
    },

    rejectVideo: {
        selector: '.gtalklet_video_no',
        event: 'click',

        delegate: function() {
            $layer.delegate(this.selector, this.event, function() {
                var jid = $(this).attr('data-jid'); 
		var data = _jingleRequests[jid];

		var jingleIq = "<iq type='set' to='" + data.from + "' id='" + data.id + "'>";
		jingleIq = jingleIq + "<jingle xmlns='urn:xmpp:jingle:1' action='session-terminate' initiator='" + data.initiator + "' sid='" + data.id + "'>";
		jingleIq = jingleIq + "<reason><decline/></reason></jingle></iq>"

		follower.report('sendIQ', {iq: jingleIq}, function(stateChange) {

		});   
	                    	    
		//$('#gtalklet_video_' + data.id).remove();
            });
        }
    },
    
    
    acceptInvitation: {
        selector: '.gtalklet_invited_ok',
        event: 'click',

        run: function(jid) {
            var base = this;

            follower.report('acceptInvitation', {jid: jid}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                var jid = $(this).attr('data-jid');
                base.run(jid);
            });
        },
        callback: function(returns) {
            // returns.threadId
            var threadId = returns.threadId;
            var $thread = $('.gtalklet_thread[data-thread-id=' + threadId + ']');
            $(selectors.chatTextarea, $thread).removeAttr('disabled');

            $('.gtalklet_message:not(.prototype)', $thread).fadeOut();
            $('.gtalklet_chat_form_mask', $thread).fadeOut();
        }
    },
    rejectInvitation: {
        selector: '.gtalklet_invited_no',
        event: 'click',

        run: function(jid) {
            var base = this;

            follower.report('rejectInvitation', {jid: jid}, function(stateChange) {
                base.callback(stateChange.returns);
            });
        },
        delegate: function() {
            var base = this;
            $layer.delegate(this.selector, this.event, function() {
                var jid = $(this).attr('data-jid');
                base.run(jid);
            });
        },
        callback: function(returns) {
            // returns.threadId
            var threadId = returns.threadId;
            var $thread = $('.gtalklet_thread[data-thread-id=' + threadId + ']');
            $(selectors.chatTextarea, $thread).removeAttr('disabled');

            $('.gtalklet_message:not(.prototype)', $thread).fadeOut();
        }
    },
    zoom: {
        run: function() {
            var ratio = $(document).width() / document.width;
            //?. zoom
            $layer.css('zoom', Math.floor(ratio*1000)/1000);  
        }
    },
    CONNECTION_PREPARED: {
        callback: function(returns) {
            // returns.commands;
            var commands = returns.commands || [];
            action.toggleConsoleCommands.run(commands);
        }
    },
    ALIGN: {
        callback: function(returns) {
            // returns.css;
            var css = returns.css || '';
            $('#gtalklet_css').attr('href', css);
            if (returns.right) {
                $('#gtalklet_right_css').remove().attr('media', 'screen').appendTo($(body));
            } else {
                $('#gtalklet_right_css').remove().attr('media', 'tty').appendTo($(body));
            }
        }
    }
};

return {
    init: init,
    build: build,
    destroy: destroy,
    handleStateChange: handleStateChange  
};

})();
