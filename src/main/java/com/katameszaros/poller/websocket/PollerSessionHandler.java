package com.katameszaros.poller.websocket;

/**
 * Created by kata on 2017.06.25..
 */

import com.katameszaros.poller.model.Choice;
import com.katameszaros.poller.model.Poll;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.websocket.Session;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

@ApplicationScope
@Component
public class PollerSessionHandler {
    private int pollId = 0;
    private final Set<Session> sessions = new HashSet<>();
    private final Set<Poll> polls = new HashSet<>();

    public void addSession(Session session) {
        sessions.add(session);
        for (Poll poll : polls) {
            JsonObject addMessage = createAddMessage(poll);
            sendToSession(session, addMessage);
        }
    }

    public void removeSession(Session session) {
        sessions.remove(session);
    }

    public List<Poll> getPolls() {
        return new ArrayList<>(polls);
    }

    public void addPoll(Poll poll) {
        poll.setId(pollId);
        polls.add(poll);
        pollId++;
        JsonObject addMessage = createAddMessage(poll);
        sendToAllConnectedSessions(addMessage);
    }

    public void removePoll(int id) {
        Poll poll = getPollById(id);
        if (poll != null) {
            polls.remove(poll);
            JsonProvider provider = JsonProvider.provider();
            JsonObject removeMessage = provider.createObjectBuilder()
                    .add("action", "remove")
                    .add("id", id)
                    .build();
            sendToAllConnectedSessions(removeMessage);
        }
    }

    public void addChoiceToPoll(Poll poll, Choice choice) {
        if (poll != null) {
            JsonProvider provider = JsonProvider.provider();
            JsonObject showChoicesMessage = provider.createObjectBuilder()
                    .add("action", "addChoice")
                    .add("id", poll.getId())
                    .add("choice", choice.getDescription())
                    .build();
            sendToAllConnectedSessions(showChoicesMessage);
        }
    }

    public void getPollDetails(int pollId) {
        Poll poll = getPollById(pollId);
        if (poll != null) {
            List<Choice> choices = poll.getChoices();
            JsonArray choicesArray = createJsonArrayFromChoices(choices);
            JsonProvider provider = JsonProvider.provider();
            JsonObject showChoicesMessage = provider.createObjectBuilder()
                    .add("action", "getPollDetails")
                    .add("id", poll.getId())
                    .add("choices", choicesArray)
                    .build();
            sendToAllConnectedSessions(showChoicesMessage);
        }
    }

    public void addVoteToPoll(int pollId, int choiceIndex) {
        Poll poll = getPollById(pollId);
        if (poll != null) {
            List<Choice> choices = poll.getChoices();
            Choice choice = choices.get(choiceIndex);
            choice.setQuantity(1);
            JsonArray choicesArray = createJsonArrayFromChoices(choices);
            JsonProvider provider = JsonProvider.provider();
            JsonObject showChoicesMessage = provider.createObjectBuilder()
                    .add("action", "addVoteToPoll")
                    .add("id", poll.getId())
                    .add("choices", choicesArray)
                    .build();
            sendToAllConnectedSessions(showChoicesMessage);

        }
    }

    private JsonArray createJsonArrayFromChoices(List<Choice> choices) {
        JsonArrayBuilder jsonArray = Json.createArrayBuilder();
        for(Choice choice : choices) {
            jsonArray.add(Json.createObjectBuilder()
                    .add("description", choice.getDescription())
                    .add("quantity", choice.getQuantity()));
            }
        JsonArray result = jsonArray.build();
        return result;
    }

    private Poll getPollById(int id) {
        for (Poll poll : polls) {
            if (poll.getId() == id) {
                return poll;
            }
        }
        return null;
    }

    private JsonObject createAddMessage(Poll poll) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
                .add("action", "add")
                .add("id", poll.getId())
                .add("name", poll.getQuestion())
                .build();
        return addMessage;
    }

    private void sendToAllConnectedSessions(JsonObject message) {
        for (Session session : sessions) {
            sendToSession(session, message);
        }
    }

    private void sendToSession(Session session, JsonObject message) {
        try {
            session.getBasicRemote().sendText(message.toString());
        } catch (IOException ex) {
            sessions.remove(session);
            Logger.getLogger(PollerSessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
