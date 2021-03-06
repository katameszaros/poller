package com.katameszaros.poller.websocket;

import com.katameszaros.poller.AppContextProvider;
import com.katameszaros.poller.model.Choice;
import com.katameszaros.poller.model.Poll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.annotation.ApplicationScope;

import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.StringReader;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by kata on 2017.06.25..
 */
@ApplicationScope
@ServerEndpoint("/actions")
public class PollerWebSocketServer {

    @Autowired
    private PollerSessionHandler sessionHandler;


    private void autowire() {
// Fixes https://github.com/spring-projects/spring-boot/issues/1722
        ApplicationContext c = AppContextProvider.getApplicationContext();
        AutowireCapableBeanFactory factory = c.getAutowireCapableBeanFactory();
        factory.autowireBean(this);
    }

    @OnOpen
    public void open(Session session) {
        autowire();
        sessionHandler.addSession(session);
    }

    @OnClose
    public void close(Session session) {
        sessionHandler.removeSession(session);
    }

    @OnError
    public void onError(Throwable error) {
        Logger.getLogger(PollerWebSocketServer.class.getName()).log(Level.SEVERE, null, error);
    }

    @OnMessage
    public void handleMessage(String message, Session session) {
        try (JsonReader reader = Json.createReader(new StringReader(message))) {
            JsonObject jsonMessage = reader.readObject();

            if ("add".equals(jsonMessage.getString("action"))) {
                Poll poll = new Poll();
                poll.setQuestion(jsonMessage.getString("name"));
                sessionHandler.addPoll(poll);
            }

            if ("remove".equals(jsonMessage.getString("action"))) {
                int id = (int) jsonMessage.getInt("id");
                sessionHandler.removePoll(id);
            }

            if ("addChoiceToPoll".equals(jsonMessage.getString("action"))) {
                String pollName = jsonMessage.getString("pollName");
                Choice choice = new Choice(jsonMessage.getString("choice"));
                List<Poll> existingPolls = sessionHandler.getPolls();
                for (Poll poll : existingPolls) {
                    if (poll.getQuestion().equals(pollName)){
                        poll.addChoice(choice);
                        sessionHandler.addChoiceToPoll(poll, choice);
                    }
                }
            }

            if ("getPollDetails".equals(jsonMessage.getString("action"))) {
                int pollId = jsonMessage.getInt("pollId");
                List<Poll> existingPolls = sessionHandler.getPolls();
                for (Poll poll : existingPolls) {
                    if (poll.getId()==pollId){
                        sessionHandler.getPollDetails(pollId);
                    }
                }
            }

            if ("addVoteToPoll".equals(jsonMessage.getString("action"))) {
                int pollId = jsonMessage.getInt("pollId");
                int choiceIndex = jsonMessage.getInt("choiceIndex");
                List<Poll> existingPolls = sessionHandler.getPolls();
                for (Poll poll : existingPolls) {
                    if (poll.getId()==pollId){
                        sessionHandler.addVoteToPoll(pollId, choiceIndex);
                    }
                }
            }
        }
    }
}
