/**
 * Created by kata on 2017.06.25..
 */

window.onload = init;
var socket = new WebSocket("ws://localhost:8080/poller_war_exploded/actions");
socket.onmessage = onMessage;

function onMessage(event) {
    var poll = JSON.parse(event.data);
    var pollId = poll.id;
    if (poll.action === "add") {
        printPollElement(poll);
    }
    if (poll.action === "remove") {
        document.getElementById(poll.id).remove();
        //poll.parentNode.removeChild(poll);
    }
    if (poll.action === "addChoice") {
        var choiceDescription = poll.choice;
        showNewChoice(pollId, choiceDescription);
    }
    if (poll.action === "getPollDetails") {
        var choices = poll.choices;
        showPollDetails(pollId, choices);
    }
    if (poll.action === "addVoteToPoll") {
        var choices = poll.choices;
        showPollDetails(pollId, choices);
    }
}

function addPoll(name) {
    var PollAction = {
        action: "add",
        name: name
    };
    socket.send(JSON.stringify(PollAction));
}

function addChoiceToPoll(pollName, choiceDescription) {
    var PollAction = {
        action: "addChoiceToPoll",
        pollName: pollName,
        choice: choiceDescription
    };
    socket.send(JSON.stringify(PollAction));
}

function removePoll(element) {
    var id = element;
    var PollAction = {
        action: "remove",
        id: id
    };
    socket.send(JSON.stringify(PollAction));
}

function getPollDetails(pollId) {
    var PollAction = {
        action: "getPollDetails",
        pollId: pollId
    };
    socket.send(JSON.stringify(PollAction));
}

function sendVote(pollId, choiceIndex) {
    var PollAction = {
        action: "addVoteToPoll",
        pollId: pollId,
        choiceIndex: choiceIndex
    };
    socket.send(JSON.stringify(PollAction));
}


function printPollElement(poll) {
    var content = document.getElementById("content");

    var pollDiv = document.createElement("div");
    pollDiv.setAttribute("id", poll.id);
    pollDiv.setAttribute("class", "choice col-lg-3 col-md-6");
    content.appendChild(pollDiv);

    var stileDiv = document.createElement("div");
    stileDiv.setAttribute("class", "panel panel-primary");
    pollDiv.appendChild(stileDiv);

    var pollName = document.createElement("div");
    pollName.setAttribute("class", "pollName panel-heading");
    pollName.innerHTML = poll.name;
    stileDiv.appendChild(pollName);

    var link = document.createElement("a");
    link.setAttribute("href", "javascript:;");
    link.setAttribute("onclick", "getPollDetails("+ poll.id + ")");
    link.setAttribute("id", poll.id);
    stileDiv.appendChild(link);

    var details = document.createElement("div");
    details.setAttribute("class", "panel-footer");
    link.appendChild(details);

    var detailsTextLeft = document.createElement("span");
    detailsTextLeft.setAttribute("class", "pull-left");
    detailsTextLeft.innerHTML = "View details";
    details.appendChild(detailsTextLeft);

    var detailsTextRight = document.createElement("span");
    detailsTextRight.setAttribute("class", "pull-right");
    detailsTextRight.innerHTML = "<i class=\"fa fa-arrow-circle-right\"></i>";
    details.appendChild(detailsTextRight);

    var clearFix = document.createElement("div");
    clearFix.setAttribute("class", "clearFix");
    details.appendChild(clearFix);

    var removePoll = document.createElement("span");
    removePoll.setAttribute("class", "removePoll");
    removePoll.innerHTML = "<a href=\"#\" OnClick=removePoll(" + poll.id + ")>Remove poll</a>";
    pollDiv.appendChild(removePoll);
}

function showNewChoice(pollId, choiceDescription) {
    var poll = document.getElementById(pollId);
    var choice = document.createElement("div");
    choice.setAttribute("class", "choice");
    choice.innerHTML = choiceDescription;
    poll.appendChild(choice);
}

function showPollDetails(pollId, choices) {
    var details = document.getElementById("details");
    $('.details').remove();
    for (var i = 0; i < choices.length; i++) {
        var choice = document.createElement("div");
        choice.setAttribute("class", "details");
        choice.innerHTML = choices[i].description;
        details.appendChild(choice);
        var voteLink = document.createElement("a");
        voteLink.setAttribute("class", "vote");
        voteLink.setAttribute("id", i);
        voteLink.setAttribute("href", "javascript:;");
        voteLink.setAttribute("onclick", "sendVote("+ pollId + "," + i + ")");
        voteLink.innerHTML= "Vote!";
        choice.appendChild(voteLink);
        var quantity = document.createElement("span");
        quantity.innerHTML = choices[i].quantity;
        choice.appendChild(quantity);
    }
}

function showForm() {
    document.getElementById("addPollForm").style.display = '';
    showChoiceForm();
}

function hideForm() {
    document.getElementById("addPollForm").style.display = "none";
}

function showChoiceForm() {
    document.getElementById("addChoices").style.display = '';
    document.getElementById("addPollForm").reset();
}

function hideChoiceForm() {
    document.getElementById("addChoices").style.display = "none";
}

function formSubmit() {
    var form = document.getElementById("addPollForm");
    var name = form.elements["poll_question"].value;
/*    hideForm();
    document.getElementById("addPollForm").reset();*/
    addPoll(name);
}

function choiceSubmit(){
    var form = document.getElementById("addPollForm");
    var pollName = form.elements["poll_question"].value;
    var form = document.getElementById("addChoices");
    var choiceDescription = form.elements["choice"].value;
    document.getElementById("addChoices").reset();
    addChoiceToPoll(pollName, choiceDescription)
}

function init() {
    hideForm();
    hideChoiceForm();
}

