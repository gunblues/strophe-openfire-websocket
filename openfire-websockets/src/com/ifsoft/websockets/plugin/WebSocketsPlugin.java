package com.ifsoft.websockets.plugin;

import org.jivesoftware.openfire.container.Plugin;
import org.jivesoftware.openfire.container.PluginManager;
import org.jivesoftware.util.*;
import org.jivesoftware.openfire.http.HttpBindManager;
import org.jivesoftware.openfire.session.LocalClientSession;
import org.jivesoftware.openfire.SessionManager;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.ConcurrentHashMap;
import java.io.File;
import java.net.InetSocketAddress;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

import com.ifsoft.websockets.*;
import com.ifsoft.websockets.servlet.XMPPServlet;


public class WebSocketsPlugin implements Plugin  {

	private static Logger Log = LoggerFactory.getLogger("WebSocketsPlugin");
	private static final String NAME 		= "ws";
	private static final String DESCRIPTION = "WebSockets Plugin for Openfire";

	private PluginManager manager;
    private File pluginDirectory;

    private ConcurrentHashMap<String, XMPPServlet.XMPPWebSocket> sockets = new ConcurrentHashMap<String, XMPPServlet.XMPPWebSocket>();


//-------------------------------------------------------
//
//
//
//-------------------------------------------------------

	public void initializePlugin(PluginManager manager, File pluginDirectory) {
		Log.info( "["+ NAME + "] initialize " + NAME + " plugin resources");

		String appName = JiveGlobals.getProperty("websockets.webapp.name", NAME);

		try {

			ContextHandlerCollection contexts = HttpBindManager.getInstance().getContexts();

			try {
				Log.info( "["+ NAME + "] initialize " + NAME + " initialize Websockets " + appName);
				ServletContextHandler context = new ServletContextHandler(contexts, "/" + appName, ServletContextHandler.SESSIONS);
				context.addServlet(new ServletHolder(new XMPPServlet()),"/server");

				WebAppContext context2 = new WebAppContext(contexts, pluginDirectory.getPath(), "/websockets");
				context.setWelcomeFiles(new String[]{"index.html"});

			}
			catch(Exception e) {
				Log.error( "An error has occurred", e );
        	}
		}
		catch (Exception e) {
			Log.error("Error initializing WebSockets Plugin", e);
		}
	}

	public void destroyPlugin() {
		Log.info( "["+ NAME + "] destroy " + NAME + " plugin resources");

		try {

			for (XMPPServlet.XMPPWebSocket socket : sockets.values())
			{
				try {
					LocalClientSession session = socket.getSession();
					session.close();
					SessionManager.getInstance().removeSession( session );
					session = null;

				} catch ( Exception e ) { }
			}

			sockets.clear();

		}
		catch (Exception e) {
			Log.error("["+ NAME + "] destroyPlugin exception " + e);
		}
	}

	public String getName() {
		 return NAME;
	}

	public String getDescription() {
		return DESCRIPTION;
	}

	public int getCount() {
		return this.sockets.size();
	}

	public ConcurrentHashMap<String, XMPPServlet.XMPPWebSocket> getSockets() {
		return sockets;
	}
}