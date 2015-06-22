   var CallState = 
   {
	CONNECTED: 0,
	RINGING: 1,
	DISCONNECTED: 2,
	PROGRESS: 3,
	INITIAL: 4
   };

   var Direction = 
   {
	OUTBOUND: 0,
	INBOUND: 1
   };


   function JingleCall(callType, localVideoStream, id, direction) 
   {
	console.log("new JingleCall " + id  + " " + direction);

	this.id = id;
	this.direction = direction;
	this.state = CallState.INITIAL;  
	this.remoteJid = null;
	this.initiator = null;
	this.pc = null; 
	this._remoteVideoStream = null;      
	this._localVideoStream = localVideoStream;  

	this.callType = callType;
	this.answererSessionId = null;
	this.offerSessionId = null;      
	this.seq = 0;

	this.inviter = false;
	this.started = false;      
	this.localOffer = null;
	this.remoteOffer = null;      
   };
      
   JingleCall.prototype.start = function() 
   {  
	console.log("JingleCall - start outbound call");

	this.state = CallState.PROGRESS;
	this.inviter = true;
	this.started = false;

	this.createPeerConnection();
            
	if (this.pc != null)
	{
		this.localOffer = this.pc.createOffer({has_audio: this.callType.audio, has_video: this.callType.video});	
		this.pc.setLocalDescription(this.pc.SDP_OFFER, this.localOffer);
		this.pc.startIce({ use_candidates: "all" });
	}            
   };
   
   JingleCall.prototype.accept = function(sdp) 
   {
      console.log("JingleCall - accept inbound call");
      
      this.state = CallState.RINGING;   
      
      var jingleIq = "<iq type='set' to='" + this.remoteJid + "' id='" + this.id + "'>";
      jingleIq = jingleIq + "<jingle xmlns='urn:xmpp:jingle:1' action='session-info' initiator='" + this.initiator + "' sid='" + this.id + "'>";
      jingleIq = jingleIq + "<ringing xmlns='urn:xmpp:jingle:apps:rtp:1:info'/></jingle></iq>";

      follower.report('sendIQ', {iq: jingleIq}, function(stateChange) {

      });   
      
      this.processSDP(sdp);
   };
   
   JingleCall.prototype.sendACK = function(id) 
   {  
      console.log("JingleCall - sendACK");
   
      var jingleIq = "<iq type='result' to='" + this.remoteJid + "' id='" + id + "'>";
      
      follower.report('sendIQ', {iq: jingleIq}, function(stateChange) {
      
      });  	
   };
   
   
   JingleCall.prototype.processSDP = function(sdp) 
   {
      	console.log("JingleCall - processSDP \n" + sdp);     
      	
	if (this.pc == null)
	{
		this.createPeerConnection();
	}

	if (this.inviter == false)
	{
		this.started = false;
		this.remoteOffer = new SessionDescription(sdp);
		this.pc.setRemoteDescription(this.pc.SDP_OFFER, this.remoteOffer);		

	} else {
		var answer = new SessionDescription(sdp);
		this.pc.setRemoteDescription(this.pc.SDP_ANSWER, answer);
	}   	
   };
   
   JingleCall.prototype.createPeerConnection = function() 
   {
        console.log("JingleCall - createPeerConnection");
   
	this.pc = new window.webkitPeerConnection00("STUN stun.l.google.com:19302", this._onIceCandidate.bind(this));
	
	this.pc.onstatechange = this._onStateChanged.bind(this);
	this.pc.onopen = this._onSessionOpened.bind(this);
	this.pc.onaddstream = this._onRemoteStreamAdded.bind(this);
	this.pc.onremovestream = this._onRemoteStreamRemoved.bind(this);
	
	this.pc.addStream(this._localVideoStream);  
   };   
   

   JingleCall.prototype._onIceCandidate = function(candidate, moreToFollow) 
   {
      	console.log("JingleCall - onIceCandidate");

	if (moreToFollow)
	{
		//console.log(candidate);
		this.localOffer.addCandidate(candidate);

	} 	else {

		if (this.started == false)
		{
			this._sendJingleIQ(this.localOffer.toSdp());
			this.started = true;
		}
	}

   };   

   JingleCall.prototype._sendJingleIQ = function(sdp)
   {
	console.log("sendJingleIQ");
	console.log(sdp);
	
	var action = this.inviter? "session-initiate" : "session-accept";
	
	var jingleIq = "<iq type='set' to='" + this.remoteJid + "' id='" + this.id + "'>";
	jingleIq = jingleIq + "<jingle xmlns='urn:xmpp:jingle:1' action='" + action + "' initiator='" + this.initiator + "' sid='" + this.id + "'>";		      			      
	jingleIq = jingleIq + "<webrtc xmlns='http://webrtc.org'>" + sdp + "</webrtc></jingle></iq>";      

	follower.report('sendIQ', {iq: jingleIq}, function(stateChange) {

	});
   }

   JingleCall.prototype._onStateChanged = function(event) 
   {  
	console.log("Jingle call " + this.id + " _onStateChanged");
	console.log(event);	
   };     

   JingleCall.prototype._onSessionOpened = function(event) 
   {
	console.log("Jingle call " + this.id + " _onSessionOpened");
	console.log(event);	
   }; 
   
   JingleCall.prototype._onRemoteStreamAdded = function(event) 
   {
       this.state = CallState.CONNECTED;  
      
    	var remoteUrl = webkitURL.createObjectURL(event.stream);
    	var localUrl = webkitURL.createObjectURL(this._localVideoStream); 
    	
    	this._remoteVideoStream = event.stream;
      
	console.log("Jingle call " + this.id + " _onRemoteStreamAdded " + remoteUrl);
	
	this.openMediaPanel(localUrl, remoteUrl);
	
	if (this.inviter == false)
	{
		this.localOffer = this.pc.createAnswer(this.remoteOffer.toSdp(), {has_audio: this.callType.audio, has_video: this.callType.video});
		this.pc.setLocalDescription(this.pc.SDP_ANSWER, this.localOffer);
		this.pc.startIce({ use_candidates: "all" });
	}	
   }; 

			  
   JingleCall.prototype.openMediaPanel = function(localUrl, remoteUrl) 
   { 
   	if (this.callType.video == true)
   	{   	
		this.closeMediaPanel(); 

		var content = "<div><table width=100%><tr><td><video width=320 height=240 src='" + localUrl + "' autoplay='autoplay' /></td><td><video width=320 height=240 src='" + remoteUrl + "' autoplay='autoplay'/></td></tr></table></div>";						
		var you = this.name || this.remoteJid.split("@")[0];

		if (this.chatType == "groupchat")
		{
		    var content = "<video width=320 height=240 src='" + remoteUrl + "' autoplay='autoplay'/>";	
		    you = this.remoteJid.split("/")[1]
		}

		this._videoPanel = new Boxy(content, {
			title: you, 
			show: true, 
			draggable: true, 
			unloadOnHide: true,
			beforeUnload: this._onBeforeUnload
		});
		
	
   	} else if (this.callType.video == false) {

		this._videoPanel = jQuery(content).css('display', 'none').appendTo(document.body);   	
   	}
   }
   
   JingleCall.prototype.closeMediaPanel = function() 
   { 
	if (this._videoPanel != null) 
	{
		this._videoPanel.hide();
		this._videoPanel = null;
	}
   }
   
			  
   JingleCall.prototype._onBeforeUnload = function(event) 
   {   
        console.log("JingleCall - _onBeforeUnload");
        
	if (this._videoPanel != null) 
        {
		this.hangup(); 
	}
	
   }
   
   JingleCall.prototype._onRemoteStreamRemoved = function(event) 
   {
    	var url = webkitURL.createObjectURL(event.stream)      
	console.log("Jingle call " + this.id + " _onRemoteStreamRemoved " + url);	
   };  
   
   
   JingleCall.prototype.hangup = function() 
   {
      	console.log("JingleCall - hangup sending session-terminate");

        this.state = CallState.DISCONNECTED; 
          
      	console.log("JingleCall - hangup remove local stream");

	this.closeMediaPanel(); 

	this.pc.close();
	
      	this.pc.removeStream(this._localVideoStream);  	
	this.pc.removeStream(this._remoteVideoStream);
	this.pc.remoteStreams[0] = null;
	this.pc = null;  
	
      	var jingleIq = "<iq type='set' to='" + this.remoteJid + "' id='" + this.id + "'>";
      	jingleIq = jingleIq + "<jingle xmlns='urn:xmpp:jingle:1' action='session-terminate' initiator='" + this.initiator + "' sid='" + this.id + "'>";
      	jingleIq = jingleIq + "<reason><success/></reason></jingle></iq>"
      
      	follower.report('sendIQ', {iq: jingleIq}, function(stateChange) {

      	});   
      	     
   };
    