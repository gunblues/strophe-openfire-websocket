# strophe-openfire-websocket
Use strophe to connect nginx or haproxy websocket proxy (openfire3.9.3)

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

####Server Side (haproxy): 
Note: if you want to connect openfire directly, just skip this step
```
        global
            nbproc 2
            daemon
            maxconn 4096

        defaults
            mode http
            timeout connect 5s
            timeout queue 5s
            timeout server 30s
            timeout client 5s
            timeout tunnel 1h

        frontend wss
            bind *:44443 ssl crt yourcrtfile_location
            timeout client 1h
            default_backend ws_backend

        backend ws_backend
            balance source
            option forwardfor # This sets X-Forwarded-For
            option httpclose
            timeout queue 86400000
            timeout server 86400000
            timeout connect 86400000

            server ws1 54.223.130.159:7070 weight 1 maxconn 4096 check inter 10000

        listen stats
            bind :55688 ssl crt yourcrtfile_location
            mode http
            stats enable
            stats hide-version
            stats realm Haproxy\ Statistics
            stats uri /
            stats auth admin:adminPassword
            stats refresh 10s
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

####Client Side (to haproxy websocket proxy (openfire)):
* Checkout strophe-openfire-websocket.js and include strophe-openfire-websocket.js to your html
* Add the code below to your js
```html
    var conn = new Openfire.Connection('wss://yourHaproxyServer:44443/ws/server');
```

####Client Side (to openfire directly):
* Checkout strophe-openfire-websocket.js and include strophe-openfire-websocket.js to your html
* Add the code below to your js
```html
    new conn = new Openfire.Connection("ws://yourOpenfireServer:7070/ws/server");
```
