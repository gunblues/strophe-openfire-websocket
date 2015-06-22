/**
 * Creates a new XMPP connection which passes XMPP packets to the server and processes XMPP packets from
 * the server.
 *
 * @param {String} url the url used for communication.
 * @param {String} domain the host being connected to.
 * @param {Object} connectionListener a connection listener which will be notified when there is a connection
 * error, when the connection is established, and when authentication is successful.
 */
function XMPPConnection(url, domain, connectionListener) {
    this.connection = new XMPP.BOSH(url);
    this.domain = domain;
    this.isConnected = false;
    this.isAuthenticated = false;

    this._packetFilters = new Array();
    this._outgoingPacketFilters = new Array();
    this._connectionListeners = new Array();
    this.addConnectionListener(connectionListener);
}

XMPPConnection.prototype = {
/**
 * Adds a connection listener which will be notified when there is a connection
 * error, when the connection is established, and when authentication is successful.
 * {
 * 		connectionSuccessful: function(connection)
 * 		connectionFailed: function(connection, error)
 * 		authenticationSuccessful: function(connection)
 * 		authenticationFailed: function(connection, error)
 * 		connectionClosed: function(connection, error)
 * 		packetsReceived: function(requestID, packetCount)
 * 		packetsProcessed: function(requestID)
 * }
 *
 * @param {Object} connectionListener the connection listener which is being added.
 */
    addConnectionListener: function(connectionListener) {
        if (!connectionListener) {
            return;
        }
        this._connectionListeners.push(connectionListener);
    },
/**
 * Removes a connection listener.
 *
 * @param {Object} connectionListener the listener which is being removed.
 */
    removeConnectionListener: function(connectionListener) {
        if (!connectionListener) {
            return;
        }
        var index = this._connectionListeners.indexOf(connectionListener);
        if (index >= 0) {
            this._connectionListeners.splice(index, 1);
        }
    },
    _fireEvent: function(event, error) {
        var self = this;
        this._connectionListeners.each(function(listener) {
            if (listener[event]) {
                try {
                    listener[event](self, error);
                }
                catch (error) {
                    console.log("Error processing listener: " +  event);
                }
            }
        });
    },
/**
 * Connects the the XMPP server provided in the XMPPConnection constructor using HTTP binding.
 * After a successful connection the connectionSuccessful event will be fired to any connection
 * listeners. If the connection is not successful the connectionFailed event will be fired.
 */
    connect: function() {
        this.connection.connect(this._configureConnection.bind(this));
    },
    logout: function(packet) {
        if (this.loggedOut) {
            return;
        }
        this.connection.disconnect((packet ? packet.toXML() : ""), this.destroy.bind(this),
                this.destroy.bind(this));
    },
/**
 * Closes the connection to the server. If an error is passed in it will be passed
 * along to the conenction listeners.
 *
 * @param {Error} error an error if it occured to close the connection.
 */
    destroy: function(error) {
        if (!this.isConnected) {
            return;
        }
        this.isConnected = false;
        this.isAuthenticated = false;

        delete this.authentication;
        delete this.username;
        delete this.password;
        this._packetHandler = Prototype.emptyFunction;

        this._packetFilters.clear();
        this._outgoingPacketFilters.clear();

        if (!this.loggedOut && !error) {
            error = new Error("connection lost");
        }

        this._fireEvent("connectionClosed", (!this.loggedOut ? error : null));
        this._connectionListeners.clear();
    },
/**
 * Authenticates with the server using the provided username and password. The SASL methods currently supported
 * are plain and anonymous. If no username is provided an anonymous session is created with the conencted server.
 * After succesful authentication, the authenticationSuccessful event is fired to all connection listeners and, if
 * authentication fails, the authenticationFailed event is fired.
 *
 * @param {String} username the username which will be used to authenticate with the server.
 * @param {String} password the password to use to authenticate with the server.
 * @param {String} resource the resource, which will uniquely identify this session from any others currently
 * using the same username on the server.
 */
    login: function(username, password, resource) {
        if (!this.authentication.auth["anonymous"] && (!username || username == "")) {
            throw new Error("Username must be provided to login.");
        }
        if (!this.authentication.auth["anonymous"] && (!password || password == "")) {
            throw new Error("Password must be provided to login.");
        }
        // don't save password for security purposes.
        this.username = username;
        this.resource = (!resource ? "office" : resource);

        var auth;
        if (!username) {
            auth = new XMPP.SASLAuth.Anonymous();
        }
        else {
            auth = new XMPP.SASLAuth.Plain(username, password, this.domain);
        }

        var authHandler = this._handleAuthentication.bind(this, auth);
        this.connection.addListener("success", authHandler);
        this.connection.send(auth.request);
    },
    _handleAuthentication: function(auth, response) {
        if(!response || response.length == 0) {
            return;
        }
        var status = auth.handleResponse(0, response[0]);
        if (status.authComplete) {
            if (status.authSuccess) {
                this.connection._clearListeners();
                this._addListeners();
                this._bindConnection();
            }
            else {
                this._fireEvent("authenticationFailed");
                this.connection.disconnect();
            }
        }
    },
    _configureConnection: function(features) {
        this.isConnected = true;

        var authentication = {};
        for (var i = 0; i < features.childNodes.length; i++) {
            var feature = features.childNodes[i];
            if (feature.tagName == "mechanisms") {
                authentication.auth = this._configureAuthMechanisms(feature);
            }
            else if (feature.tagName == "bind") {
                authentication.bind = true;
            }
            else if (feature.tagName == "session") {
                authentication.session = true;
            }
        }
        this.authentication = authentication;
        this._fireEvent("connectionSuccessful");
    },
    _configureAuthMechanisms: function(mechanisms) {
        var authMechanism = {};
        for (var i = 0; i < mechanisms.childNodes.length; i++) {
            var mechanism = mechanisms.childNodes[i];
            if (mechanism.firstChild.nodeValue == "PLAIN") {
                authMechanism["plain"] = true;
            }
            else if (mechanism.firstChild.nodeValue == "ANONYMOUS") {
                authMechanism["anonymous"] = true;
            }
        }

        if (!authMechanism) {
            authMechanism = function() {
                // here we will throw an error
                return false;
            }
        }

        return authMechanism;
    },
    _addListeners: function() {
        this.connection.addListener("success", this._handlePackets.bind(this));
        this.connection.addListener("failure", this._handleFailure.bind(this));
        this.connection.addListener("exception", this._handleException.bind(this));
    },
    _bindConnection: function() {
        var bindIQ = new XMPP.IQ("set");
        bindIQ.setXMLNS("jabber:client");

        var bind = bindIQ.addExtension("bind", "urn:ietf:params:xml:ns:xmpp-bind");

        bind.appendChild(bindIQ.doc.createElement("resource"))
                .appendChild(bindIQ.doc.createTextNode(this.resource));

        //console.debug("Bind the connection! " +  bindIQ.doc.documentElement);

        var callback = function(packet) {
            var bind = packet.getExtension("bind");

            //console.debug("Bind Response: " +  bind);

            var jid = bind.firstChild;
            this._jid = jid.firstChild.nodeValue;
            this._establishSession();
        }.bind(this);
        var id = bindIQ.getID();
        var packetFilter = new org.jive.spank.PacketFilter(callback, function(packet) {
            return packet.getID() == id;
        });

        this.sendPacket(bindIQ, packetFilter);
    },
    _establishSession: function() {
        var sessionIQ = new XMPP.IQ("set");
        sessionIQ.setXMLNS("jabber:client");

        sessionIQ.addExtension("session", "urn:ietf:params:xml:ns:xmpp-session");
        //console.debug("Establishing session: " +  sessionIQ.doc.documentElement);

        var connection = this;
        var callback = function(originalRequest) {
            connection.isAuthenticated = true;
            connection._fireEvent("authenticationSuccessful");
        }
        var id = sessionIQ.getID();
        var packetFilter = new org.jive.spank.PacketFilter(callback, function(packet) {
            return packet.getID() == id;
        });

        this.sendPacket(sessionIQ, packetFilter);
    },
/**
 * Sends a packet to the connected XMPP server. The packet, or a group of packets,
 * is wrapped in a body tag and sent to the server using HTTPBinding.
 *
 * @param {XMPP.Packet} packet a valid xmpp packet.
 * @param {org.jive.spank.PacketFilter} convinence for adding a PacketFilter,
 * the filter will be removed upon its execution.
 */
    sendPacket: function(packet, packetFilter) {
        if (!packet || !(typeof packet == "object" && packet instanceof XMPP.Packet)) {
            return;
        }

        if (packetFilter) {
            this.addPacketFilter(packetFilter, true);
        }

        this._handlePacket(this._outgoingPacketFilters.slice(), packet);
        this.connection.send(packet.toXML());
    },
    
    sendXML: function(packetXML) {
        this.connection.send(packetXML);    
    },
    
    _handleFailure: function(request, header) {
        console.log("Request failure: " +  header);
        this.destroy(header);
    },
    _handleException: function(request, error) {
        console.log("Request exception: " +  error);
        this.destroy(error);
    },
    _handlePackets: function(packets) {
        var len = packets.length;
        this._fireEvent("packetsReceived");
        for (var i = 0; i < len; i++) {
            var packetElement = packets[i].cloneNode(true);
            var packetType = packetElement.tagName;
            var packet;

            if (packetType == "iq") {
                packet = new XMPP.IQ(null, null, null, packetElement);
            }
            else if (packetType == "presence") {
                packet = new XMPP.Presence(null, null, packetElement);
            }
            else if (packetType == "message") {
                packet = new XMPP.Message(null, null, null, packetElement);
                //console.log(packet.toXML())
            }
            else {
                console.log("Server returned unknown packet, tossing: " +  packetElement);
                continue;
            }
            // Slice the array so we have a copy of it. This keeps us safe in case a listener
            // is removed while processing packets.
            this._handlePacket(connection._packetFilters.slice(), packet);

        }
        this._fireEvent("packetsProcessed");
    },
/**
 * Adds a PacketFilter to the connection. An optional parameter of removeOnExecution when true will cause the
 * PacketFilter to be removed from the connection upon its execution. The PacketFilter is checked if it should
 * be executed for each packet that is recieved on the connection.
 *
 * @param {org.jive.spank.PacketFilter} packetFilter the filter being added to the connection.
 * @param {boolean} removeOnExecution (optional) true if the filter should be removed after it has been
 * exectuted for the first time.
 */
    addPacketFilter: function(packetFilter, removeOnExecution) {
        if (!packetFilter || !(packetFilter instanceof org.jive.spank.PacketFilter)) {
            throw Error("PacketFilter must be an instance of PacketFilter");
        }
        packetFilter.removeOnExecution = removeOnExecution;
        this._packetFilters.push(packetFilter);
    },
/**
 * Removes a PacketFilter from the connection.
 *
 * @param {org.jive.spank.PacketFilter} packetFilter the packet filter which is being removed.
 */
    removePacketFilter: function(packetFilter) {
        if (!packetFilter) {
            return;
        }

        var index = this._packetFilters.indexOf(packetFilter);
        if (index >= 0) {
            this._packetFilters.splice(index, 1);
        }
    },
/**
 * Adds an outgoing PacketFilter to the connection. An outgoing PacketFilter is executed on every packet being
 * sent from this connection.
 *
 * @param {org.jive.spank.PacketFilter} packetFilter the PacketFilter which will be executed on each packet being
 * sent to the server.
 */
    addOutgoingPacketFilter: function(packetFilter) {
    
        if (!packetFilter || !(packetFilter instanceof org.jive.spank.PacketFilter)) {
            throw Error("PacketFilter must be an instance of PacketFilter");
        }
        this._outgoingPacketFilters.push(packetFilter);
    },
    
    _handlePacket: function(packetFilters, packet) {
        for (var i = packetFilters.length - 1; i >= 0; i--) {
            try {
                if (packetFilters[i].accept(packet) && packetFilters[i].removeOnExecution) {
                    this.removePacketFilter(packetFilters[i]);
                }
            }
            catch(e) {
                //console.log("Error processing packet: " +  e.message);
                
                if (packetFilters[i].removeOnExecution) {
                    this.removePacketFilter(packetFilters[i]);
                }
            }
        }

    }
}

if(!XMPP) {
    var XMPP = {};
}

/**
* Creates a new instance of BOSH. BOSH, or Bidirectional-streams Over Synchronous HTTP. Provides
* request and response over HTTP and is intended for use in the broswer.
*/
XMPP.BOSH = function(binding, configuration) {
    if (binding.charAt(0) == '/') {
        this.binding = binding;
    }
    else {
        this.binding = new Poly9.URLParser(binding);
    }
    this.requestCount = 0;
    this.failedRequests = new Array();
    this.lastPollTime = 0;
    this._configure($H(configuration).merge(this.defaultConfiguration));
    this.listeners = {
        "success": [],
        "failure": [],
        "exception": []
    }
    this._requestQueue = new Array();
}

XMPP.BOSH.prototype = {
    defaultConfiguration: {
        maxConcurrentRequests: 2
    },
    _boshVersion: 1.6,
    _headers: {
        'post' : [],
        'get': ['Cache-Control', 'no-store', 'Cache-Control', 'no-cache', 'Pragma', 'no-cache']
    },
    _configure: function(configuration) {
        for(var i in configuration) {
            if (!(typeof configuration[i] == "Function")) {
                this[i] = configuration[i];
            }
        }
    },
    connect: function(successfulConnectionCallback, unsuccessfulConnectionCallback) {
        // create our connection listeners
        var success = this._processConnectionResponse.bind(this, successfulConnectionCallback);
        var failure = this._processConnectionFailure.bind(this, unsuccessfulConnectionCallback);

        // add our connection listeners
        this.listeners["success"].push(success);
        this.listeners["failure"].push(failure)
        this.listeners["exception"].push(failure);

        var bodyContent = this._buildSessionRequest(this["maxConcurrentRequests"] - 1,
            this._getNextRID(), true, 10, this._boshVersion);
        //console.debug("Initial request: " +  bodyContent);
        this.doRequest(bodyContent, true);
    },
    isConnected: function() {
        return this._isConnected && !this._isDisconnecting;
    },
    disconnect: function(xml, successfulDisconnectionCallback, unsuccessfulDisconnectionCallback) {
        this._cancelPoll();
        this._clearListeners();
        if(!this.isConnected()) {
            return;
        }

        // create our disconnection listeners
        var success = this._processDisconnectionResponse.bind(this,
                successfulDisconnectionCallback);
        var failure = this._processDisconnectionFailure.bind(this,
                unsuccessfulDisconnectionCallback);

        // add our connection listeners
        this.listeners["success"].push(success);
        this.listeners["failure"].push(failure)
        this.listeners["exception"].push(failure);

        this._isDisconnecting = true;

        var attrs = {
            xmlns: "http://jabber.org/protocol/httpbind",
            rid: this._getNextRID(),
            sid: this._sid,
            type: "terminate"
        }
        this.doRequest(org.jive.util.XML.element("body", (xml ? xml : ""), attrs));
    },
    _processConnectionResponse: function(callback, responseBody) {
        //console.debug("Intial response: " +  responseBody);

        this._sid = responseBody.getAttribute("sid");
        this._pollingInterval = responseBody.getAttribute("polling") * 1000;
        // if we have a polling interval of 1, we want to add an extra second for a little bit of
        // padding.
        //if(this._pollingInterval <= 1000 && this._pollingInterval > 0) {
        //    this._pollingInterval += 1000;
        //}
        
        this._wait = responseBody.getAttribute("wait");
        this._inactivity = responseBody.getAttribute("inactivity");
        var serverRequests = responseBody.getAttribute("requests");
        if (!serverRequests) {
            this._maxConcurrentRequests = this["maxConcurrentRequests"];
        }
        else {
            this._maxConcurrentRequests = Math.min(serverRequests, this["maxConcurrentRequests"]);
        }
        this._isConnected = true;
        this._clearListeners();
        if(callback) {
            var arg;
            if(responseBody.firstChild) {
                arg = responseBody.firstChild;
            }
            callback(arg);
        }
    },
    _processConnectionFailure: function(callback, request, header) {
        console.log("Connection to the server failed: " + header);
        this._clearListeners();
        if(callback) {
            callback();
        }
    },
    _processDisconnectionResponse: function(callback, responseBody) {
        this._isDisconnecting = false;
        this._isConnected = false;
        this._clearListeners();
        if (callback) {
            callback();
        }
    },
    _processDisconnectionFailure: function(callback, responseBody) {
        this._isDisconnecting = false;
        this._isConnected = false;
        this._clearListeners();
        if (callback) {
            callback();
        }
    },
    _buildSessionRequest: function(holdValue, ridValue, secureValue, waitValue, version) {
        var attrs = {
            xmlns: "http://jabber.org/protocol/httpbind",
            hold: holdValue,
            rid: ridValue,
            secure: secureValue,
            wait: waitValue,
            ver: version
        }

        return org.jive.util.XML.element("body", "", attrs);
    },
    send: function(request) {
        if(!this.isConnected()) {
            throw Error("Not connected, cannot send packets.");
        }

        if (this._shouldQueueRequest()) {
            this._queueRequest(request);
        }
        else {
            this._sendQueuedRequests(request);
        }
    },
    _send: function(requests) {
        if (!this.isConnected()) {
            throw Error("Not connected, cannot send packets.");
        }
        this._cancelPoll();
        this.doRequest(this._createRequest(requests.join("")), requests.length <= 0);
    },
    _shouldQueueRequest: function() {
        return this.requestCount >= this._maxConcurrentRequests;
    },
    _queueRequest: function(request) {
        this._requestQueue.push(request);
    },
    destroy: function() {
        this._clearListeners();
        this._cancelPoll();
    },
    _handlePoll: function(pollTime) {
        this._cancelPoll();
        if(!pollTime) {
            pollTime = this._pollingInterval;
        }
        this._timer = new TimeoutExecutor(this._pollServer.bind(this), pollTime);
    },
    _pollServer: function(responseHandler) {
        if(!this._isConnected) {
            return;
        }
        if(this._areRequestsQueued()) {
            this._sendQueuedRequests();
        }
        if (this.isCurrentlyPolling) {
            return;
        }
        var currentTime = new Date().valueOf();
        var currentInterval = currentTime - this.lastPollTime;
        if(currentInterval < this._pollingInterval) {
            var delayTime = (this._pollingInterval - currentInterval);

            this._handlePoll(delayTime);
            return;
        }
        this.doRequest(this._createRequest(), true);
    },
    _cancelPoll: function() {
        if (this._timer) {
            this._timer.cancel();
            delete this._timer;
        }
    },
    _getNextRID: function() {
        if (!this._rid) {
            this._rid = Math.floor(Math.random() * 1000000);
        }
        return ++this._rid;
    },
    _createRequest: function(bodyContent) {
        var attrs = {
            xmlns: "http://jabber.org/protocol/httpbind",
            rid: this._getNextRID(),
            sid: this._sid
        }

        return org.jive.util.XML.element("body", bodyContent, attrs);
    },
    addListener: function(event, eventHandler) {
        if(!this._isConnected) {
            throw Error("Must be connected to add a connection listener.");
        }
        this.listeners[event].push(eventHandler);
    },
    _clearListeners: function() {
        for(var event in this.listeners) {
            this.listeners[event] = [];
        }
    },
    _fireEvent: function(event) {
        if(!this.listeners[event]) {
            return;
        }
        var args = $A(arguments);
        args.shift();
        var listenerCount = this.listeners[event].length;
        for (var i = 0; i < listenerCount; i++) {
            this.listeners[event][i].apply(null, args);
        }
    },
    doRequest: function(bodyContent, isRequestPoll) {
        if (this.failureState) {
            throw Error("HTTP connection in failure state and must be reset.");
        }
        var successCallback = this._successCallback.bind(this, isRequestPoll);
        var failureCallback = this._failureCallback.bind(this, bodyContent);
        var exceptionCallback = this._exceptionCallback.bind(this, bodyContent);

        if(isRequestPoll) {
            this.isCurrentlyPolling = true;
        }

        this.requestCount++;
        var requestUrl;
        var method;
        if (typeof this.binding == "string") {
            requestUrl = this.binding;
            method = "post";
        }
        return new Ajax.Request(requestUrl, {
            method: method,
            postBody: bodyContent,
            requestHeaders: this._headers[method],
            onSuccess: successCallback,
            onException: exceptionCallback,
            onFailure: failureCallback
        });
    },
    _successCallback: function(isRequestPoll, originalRequest) {
        this.requestCount--;
        if (originalRequest.responseXML.firstChild) {
            var body = originalRequest.responseXML.firstChild;
            // Special case for initial connection.
            if(this._sid) {
                body = $A(body.childNodes);
            }
            this._fireEvent("success", body);
        }

        if(isRequestPoll) {
            this.lastPollTime = new Date().valueOf();
        }

        if(this._isConnected) {
            this._checkQueueAndPoll(isRequestPoll)
        }
    },
    _checkQueueAndPoll: function(isLastRequestPoll) {
        if (this._areRequestsQueued()) {
            this._sendQueuedRequests();
        }
        else if(!isLastRequestPoll){
            if (!this._timer) {
                this._pollServer();
            }
        }
        // Is our last request a poll?
        else {
            this.isCurrentlyPolling = false;
            this._handlePoll();
        }
    },
    _areRequestsQueued: function() {
        return this._requestQueue.length > 0;
    },
    _sendQueuedRequests: function(xml) {
        if(xml) {
            this._requestQueue.push(xml);
        }
        this._send(this._requestQueue.compact());
        this._requestQueue.clear();
    },
    _failureCallback: function(bodyContent, originalRequest, header) {
        this.requestCount--;
        // Turning on a failure state will cause an subsequent requests to fail.
        this._isConnected = false;
        this.failureState = true;
        this.failedRequests.splice(0, 0, bodyContent);
        this._fireEvent("failure", bodyContent, header);
    },
    _exceptionCallback: function(bodyContent, originalRequest, error) {
        this.requestCount--;
        // Turning on a failure state will cause an subsequent requests to fail.
        this._isConnected = false;
        this.failureState = true;
        console.log("Request exception! " + error);
        this.failedRequests.splice(0, 0, bodyContent);
        this._fireEvent("exception", originalRequest, error);
    }
}

var TimeoutExecutor = Class.create();
TimeoutExecutor.prototype = {
    initialize: function(callback, timeout) {
        this.callback = callback;
        this.timeout = timeout;
        this.currentlyExecuting = false;

        this.registerCallback();
    },
    registerCallback: function() {
        this.timeoutID = setTimeout(this.onTimerEvent.bind(this), this.timeout);
    },
    onTimerEvent: function() {
        try {
            this.currentlyExecuting = true;
            if (this.callback && this.callback instanceof Function) {
                this.callback();
            }
        }
        finally {
            this.currentlyExecuting = false;
            delete this.timeoutID;
        }
    },
    cancel: function() {
        if (!this.currentlyExecuting && this.timeoutID) {
            clearTimeout(this.timeoutID);
            delete this.timeoutID;
        }
    },
    reset: function() {
        if (!this.currentlyExecuting && this.timeoutID) {
            clearTimeout(this.timeoutID);
            delete this.timeoutID;
            this.registerCallback();
        }
    }
}
