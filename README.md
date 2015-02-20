# strophe-openfire-websocket
Use strophe to connect nginx websocket proxy (openfire3.9.3)

Especially thanks to Dele Olajide for developing the project (https://code.google.com/p/openfire-websockets/)

## Installation
####Server Side (openfire): 
* Download websocket plugin (websockets-0.0.0.6.zip) - https://code.google.com/p/openfire-websockets/downloads/list
* Unzip file to your openfire plugin directory
* Restart openfire server
* Visit openfire admin site and select the tab "Server" and you should see the child tab "WebSockets" and the default "Web Application Name" is ws

####Server Side (nginx): 
Note: if you want to connect openfire directly, just skip this step
```
        location /xmpp-websocket {
            proxy_pass http://yourOpenfireServer:7070/ws/server;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            tcp_nodelay on;
        }
```

####Client Side (to nginx websocket proxy (openfire)):
* Checkout strophe-openfire-websocket.js and include strophe-openfire-websocket.js to your html
* Add the code below to your js
```html
    var arrURL = document.URL.split('/'),
        protocol = (arrURL[0] === 'http:' ? 'ws://' : 'wss://'),
        wsUrl = protocol + arrURL[2] + '/xmpp-websocket';

    var conn = new Openfire.Connection(wsUrl);
```

####Client Side (to openfire directly):
* Checkout strophe-openfire-websocket.js and include strophe-openfire-websocket.js to your html
* Add the code below to your js
```html
    new conn = new Openfire.Connection("ws://yourOpenfireServer:7070/ws/server");
```
