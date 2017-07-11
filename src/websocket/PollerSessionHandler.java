package websocket;

/**
 * Created by kata on 2017.06.25..
 */

import model.Choice;
import model.Poll;

import javax.enterprise.context.ApplicationScoped;
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

@ApplicationScoped
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
                    .add("pollId", poll.getId())
                    .add("choice", choice.getDescription())
                    .build();
            sendToAllConnectedSessions(showChoicesMessage);
        }
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
