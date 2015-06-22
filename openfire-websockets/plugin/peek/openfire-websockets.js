/** Class: OpenfireWebSockets
 *  WebSockets Connection Manager for Openfire
 *
 *  Thie class manages a WebSockets connection
 *  to an Openfire XMPP server and dispatches events to the user callbacks as
 *  data arrives.  It uses the server side Openfire authentication
 *
 *  After creating a OpenfireWebSockets object, the user will typically
 *  call connect() with a user supplied callback to handle connection level
 *  events like authentication failure, disconnection, or connection
 *  complete.
 *
 *  To send data to the connection, use send(doc) or sendRaw(text)
 *
 *  Use xmlInput(doc) and RawInput(text) overrideable function to receive XML data coming into the
 *  connection.
 *
 *  Create and initialize a OpenfireWebSockets object.
 *
 *
 *  Returns:
 *    A new OpenfireWebSockets object.
 */
 
OpenfireWebSockets = function() 
{
	if (!window.WebSocket) 
	{
		window.WebSocket=window.MozWebSocket;

		if (!window.WebSocket)
		{
			var msg = "WebSocket not supported by this browser";			
			alert(msg);
			throw Error(msg);
		}
	}
}

OpenfireWebSockets.prototype = {

    /** Function: connect
     *  Starts the connection process.
     *
     *
     *  Parameters:
     *    (String) username - The Openfire username.  
     *    (String) pass - The user's password.
     *    (String) resource - The user resource for this connection.     
     *    (Function) callback The connect callback function.
     */
     
    connect: function (username, password, resource, callback)
    { 

        this.username = username;
        this.password = password;        
        this.resource = (!resource ? "spank" : resource);
        this.connect_callback = callback;  
        
	this._isConnected = false;
	this.protocol = window.location.protocol == "http:" ? "ws:" : "wss:"

	this._ws = new WebSocket(this.protocol + "//" + window.location.host + "/ws/server?username=" + username + "&password=" + password + "&resource=" + resource, "xmpp");        
	this._ws.onopen = this._onopen.bind(this);
	this._ws.onmessage = this._onmessage.bind(this);
	this._ws.onclose = this._onclose.bind(this);
	
	window.openfireWebSocket = this;
    },

    disconnect: function() {
    
        if(!this.isConnected() || this._ws == null) {
            return;
        }
        
        this._ws.close();
        
    },

    
    isConnected: function() {
        
        return this._isConnected;
    },
    
    _disconnected: function() 
    {        
	clearInterval(this.interval);
    	this._ws = null;    	
        this._isConnected = false;
        
    	if (typeof this.connect_callback == 'function') this.connect_callback("disconnected");          
    }, 
    
  
    _onopen: function() 
    {       
    	this._isConnected = true;
   	
    	if (typeof this.connect_callback == 'function')
    	{    	
		try {
	
			this.connect_callback("connected");		
		} catch (e) {
			alert("User connection callback caused an exception: " + e);
		} 
	}
	
	this.interval = setInterval (function() {window.openfireWebSocket.sendRaw(" ")}, 10000 );	
    },

    _onclose: function() 
    {
    	this._disconnected();    
    },
    
    _onmessage: function(packet) {

        this.xmlInput(this._textToXML(packet.data));
        this.rawInput(packet.data);
    },

    sendRaw: function(xml) {

        if(!this.isConnected() || this._ws == null) {
            throw Error("Not connected, cannot send packets.");
        }

	if (xml != " ")
	{
		this.xmlOutput(this._textToXML(xml));
		this.rawOutput(xml);
	}
	
    	this._ws.send(xml);
    },
    
    send: function(elem) {
    
        if(!this.isConnected() || this._ws == null) {
            throw Error("Not connected, cannot send packets.");
        }
   
	var xml = this._serialize(elem);

	this.xmlOutput(elem);
	this.rawOutput(xml);

	this._ws.send(xml);
    },

    _textToXML: function (text) {
    
    	console.log(text);
    	
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

        return doc;
    },

    _serialize: function (elem)
    {
        var result;

        if (!elem) { return null; }

        if (typeof(elem.tree) === "function") {
            elem = elem.tree();
        }

        var nodeName = elem.nodeName;
        var i, child;

        if (elem.getAttribute("_realname")) {
            nodeName = elem.getAttribute("_realname");
        }

        result = "<" + nodeName;
        
        for (i = 0; i < elem.attributes.length; i++) {
               if(elem.attributes[i].nodeName != "_realname") {
                 result += " " + elem.attributes[i].nodeName.toLowerCase() +
                "='" + elem.attributes[i].value
                    .replace("&", "&amp;")
                       .replace("'", "&apos;")
                       .replace("<", "&lt;") + "'";
               }
        }

        if (elem.childNodes.length > 0) {
            result += ">";
            
            for (i = 0; i < elem.childNodes.length; i++) {
                child = elem.childNodes[i];
                if (child.nodeType == 1) {
                    // normal element, so recurse
                    result += this._serialize(child);
                } else if (child.nodeType == 3) {
                    // text element
                    result += child.nodeValue;
                }
            }
            result += "</" + nodeName + ">";
        } else {
            result += "/>";
        }

        return result;
    },
    
    
    /** Function: xmlInput
     *  User overrideable function that receives XML data coming into the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > OpenfireWebSockets.xmlInput = function (elem) {
     *  >   (user code)
     *  > };
     *
     *  Parameters:
     *    (XMLElement) elem - The XML data received by the connection.
     */
     
    xmlInput: function (elem)
    {
        return;
    },

    /** Function: xmlOutput
     *  User overrideable function that receives XML data sent to the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > OpenfireWebSockets.xmlOutput = function (elem) {
     *  >   (user code)
     *  > };
     *
     *  Parameters:
     *    (XMLElement) elem - The XMLdata sent by the connection.
     */
     
    xmlOutput: function (elem)
    {
        return;
    },

    /** Function: rawInput
     *  User overrideable function that receives raw data coming into the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > OpenfireWebSockets.rawInput = function (data) {
     *  >   (user code)
     *  > };
     *
     *  Parameters:
     *    (String) data - The data received by the connection.
     */
     
    rawInput: function (data)
    {
        return;
    },

    /** Function: rawOutput
     *  User overrideable function that receives raw data sent to the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > OpenfireWebSockets.rawOutput = function (data) {
     *  >   (user code)
     *  > };
     *
     *  Parameters:
     *    (String) data - The data sent by the connection.
     */
     
    rawOutput: function (data)
    {
        return;
    }   
}