package com.katameszaros.poller.model;

/**
 * Created by kata on 2017.06.25..
 */
public class Vote {

    private Poll poll;
    private Choice choice;

    public Vote(Poll poll, Choice choice) {
        this.poll = poll;
        this.choice = choice;
        poll.addVote(this);
        choice.setQuantity(choice.getQuantity()+1);
    }
}
