package com.katameszaros.poller.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kata on 2017.06.25..
 */
public class Poll {

    private int id;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    private String question;
    private List<Choice> choices;

    private List<Vote> votes;

    public Poll() {
        this.votes = new ArrayList<>();
        this.choices = new ArrayList<>();
    }

    public void addVote (Vote vote){
        this.votes.add(vote);
    }

    public void setVotes(List<Vote> votes) {
        this.votes = votes;
    }

    public List<Vote> getVotes() {
        return votes;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void addChoice(Choice choice) {
        this.choices.add(choice);
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
