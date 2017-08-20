package com.katameszaros.poller;

import com.katameszaros.poller.AppContextProvider;
import com.katameszaros.poller.websocket.PollerSessionHandler;
import com.katameszaros.poller.websocket.PollerWebSocketServer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import javax.servlet.ServletContext;

@SpringBootApplication
public class PollerApplication {

	public static void main(String[] args) {
		SpringApplication.run(PollerApplication.class, args);
	}

	@Bean
	public ServletContextAware endpointExporterInitializer(final ApplicationContext applicationContext) {
		return new ServletContextAware() {

			@Override
			public void setServletContext(ServletContext servletContext) {
				ServerEndpointExporter serverEndpointExporter = new ServerEndpointExporter();
				serverEndpointExporter.setApplicationContext(applicationContext);
				try {
					serverEndpointExporter.afterPropertiesSet();
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			}
		};
	}

	@Bean
	public ServerEndpointExporter serverEndpointExporter() {
		return new ServerEndpointExporter();
	}

/*	@Bean
	public PollerSessionHandler handler() {
		return new PollerSessionHandler();
	}*/

	@Bean
	public PollerWebSocketServer endpoint() {
		return new PollerWebSocketServer();
	}

	@Bean
	public AppContextProvider provider() {
		return new AppContextProvider();
	}

}
