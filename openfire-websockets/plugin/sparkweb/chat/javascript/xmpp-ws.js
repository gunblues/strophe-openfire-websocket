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
    this.connection = new XMPP.WS();
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
                    console.error("Error processing listener: " + error);
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

        // don't save password for security purposes.
        this.username = username;
        this.resource = (!resource ? "spank" : resource);
        
        var authHandler = this._handleAuthentication.bind(this);
        this.connection.addListener("success", authHandler);        
        this.connection.login(username, password, resource);
    },
    _handleAuthentication: function() {

 connection._fireEvent("authenticationSuccessful");
 	
	this.connection._clearListeners();                
	this._addListeners();                
    },
    
    _configureConnection: function() {
        this.isConnected = true;
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

        console.debug("Bind the connection! %x", bindIQ.doc.documentElement);

        var callback = function(packet) {
            var bind = packet.getExtension("bind");

            console.debug("Bind Response: %x", bind);

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
        console.debug("Establishing session: %x", sessionIQ.doc.documentElement);

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
    _handleFailure: function(request, header) {
        console.error("Request failure: " + header);
        this.destroy(header);
    },
    _handleException: function(request, error) {
        console.error("Request exception: " + error);
        this.destroy(error);
    },
    _handlePackets: function(element) {

        this._fireEvent("packetsReceived");
 
	var packetElement = element.cloneNode(true);
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
	}
	else {
		console.error("Server returned unknown packet, tossing:" + packetElement);
	}
	// Slice the array so we have a copy of it. This keeps us safe in case a listener
	// is removed while processing packets.
	
	this._handlePacket(connection._packetFilters.slice(), packet);

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
                console.error("Error processing packet: " + e.message);
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


XMPP.WS = function() 
{
	if (!window.WebSocket) 
	{
		window.WebSocket=window.MozWebSocket;

		if (!window.WebSocket) alert("WebSocket not supported by this browser");
	}
	
	this.listeners = {"success": [], "failure": [],	"exception": []	}
}

XMPP.WS.prototype = {

    connect: function(successfulConnectionCallback) 
    {
    	//console.log("XMPP.WS - connect");
    	
        this._isConnected = false;
	this._clearListeners();

        // create our connection listeners
        var success = this._processConnectionResponse.bind(this, successfulConnectionCallback);
 
        // add our connection listeners
        this.listeners["success"].push(success);
        
    	this._fireEvent("success");        
    },

    login: function(username, password, resource) 
    {
    	//console.log("XMPP.WS - login " + username);
    	
        this.username = username;
        this.password = password;        
        this.resource = (!resource ? "spank" : resource);
        this.protocol = window.location.protocol == "http:" ? "ws:" : "wss:"
        
	this._ws = new WebSocket(this.protocol + "//" + window.location.host + "/ws/server?username=" + username + "&password=" + password + "&resource=" + resource, "xmpp");        
	this._ws.onopen = this._onopen.bind(this);
	this._ws.onmessage = this._onmessage.bind(this);
	this._ws.onclose = this._onclose.bind(this);
	
	window.openfireWebSocket = this;	
    },

    disconnect: function(xml, successfulDisconnectionCallback, unsuccessfulDisconnectionCallback) 
    {
    	//console.log("XMPP.WS - disconnect");
    
        if(!this.isConnected() || this._ws == null) {
            return;
        }

	if (xml) this.send(xml);
	
        this._clearListeners();
        
        // create our disconnection listeners
        var success = this._processDisconnectionResponse.bind(this, successfulDisconnectionCallback);
        var failure = this._processDisconnectionFailure.bind(this,  unsuccessfulDisconnectionCallback);

        // add our connection listeners
        this.listeners["success"].push(success);
        this.listeners["failure"].push(failure)
        this.listeners["exception"].push(failure);
        
        this._ws.close();
        
    },

    isConnected: function() 
    {
        
        return this._isConnected;
    },
    
    
    _onopen: function() 
    {

    	//console.log("XMPP.WS - _onopen");
    	
    	this._isConnected = true;    
    	this._fireEvent("success");
    	
	this.interval = setInterval (function() {window.openfireWebSocket._ws.send(" ")}, 10000 );	
    	
    },

    _onclose: function() 
    {

   	//console.log("XMPP.WS - _onclose");
    	
    	clearInterval(this.interval);
    	
    	this._ws = null;
    	this._isConnected = false;    	
	this._fireEvent("failure"); 
    },
    
    _onmessage: function(packet) {
    
   	//console.log("XMPP.WS - _onmessage " + packet.data);

	this._fireEvent("success", this._textToXML(packet.data));
    },

    send: function(xml) 
    {

   	//console.log("XMPP.WS - send " + xml);
    
        if(!this.isConnected()) {
            throw Error("Not connected, cannot send packets.");
        }

	if (this._ws)
	{        
        	this._ws.send(xml);
        }
    },

    _textToXML: function (text) 
    {
    
    	//console.log(text);
    	
        var doc = null;
        
        if (window['DOMParser']) {
            var parser = new DOMParser();
            doc = parser.parseFromString(text, 'text/xml');

        } else if (window['ActiveXObject']) {
            var doc = new ActiveXObject("MSXML2.DOMDocument");
            doc.async = false;
            doc.loadXML(text);
            
        } else {
            throw Error('No DOMParser object found.');
        }

        return doc.firstChild;
    },
    

    _processConnectionResponse: function(callback) 
    {
        this._clearListeners();
        
        if(callback) 
        {
            callback();
        }
    },
    _processConnectionFailure: function(callback) 
    {
        this._clearListeners();

        if(callback) 
        {
            callback();
        }
    },
    _processDisconnectionResponse: function(callback) 
    {
        this._clearListeners();
        
        if (callback) 
        {
            callback();
        }
    },
    _processDisconnectionFailure: function(callback) 
    {
        this._clearListeners();
        
        if (callback) 
        {
            callback();
        }
    },    

    destroy: function() 
    {

    },
    
    addListener: function(event, eventHandler) 
    {
    	//console.log("XMPP.WS - addListener");

        this.listeners[event].push(eventHandler);
    },
    
    _clearListeners: function() 
    {
        for(var event in this.listeners) {
            this.listeners[event] = [];
        }
    }, 
    
    _fireEvent: function(event) 
    {
    	//console.log("XMPP.WS - _fireEvent");
    
        if(!this.listeners[event]) {
            return;
        }
        
        var args = $A(arguments);
        args.shift();        
        var listenerCount = this.listeners[event].length;
        
        for (var i = 0; i < listenerCount; i++) 
        {
            this.listeners[event][i].apply(null, args);
        }
    }    
}

