/**
 * Created by kata on 2017.06.25..
 */

window.onload = init;
var socket = new WebSocket("ws://localhost:8080/poller_war_exploded/actions");
socket.onmessage = onMessage;

function onMessage(event) {
    var poll = JSON.parse(event.data);
    if (poll.action === "add") {
        printPollElement(poll);
    }
    if (poll.action === "remove") {
        document.getElementById(poll.id).remove();
        //poll.parentNode.removeChild(poll);
    }
    if (poll.action === "addChoice") {
        var pollId = poll.pollId;
        var choiceDescription = poll.choice;
        showNewChoice(pollId, choiceDescription);
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


function printPollElement(poll) {
    var content = document.getElementById("content");

    var pollDiv = document.createElement("div");
    pollDiv.setAttribute("id", poll.id);
    content.appendChild(pollDiv);

    var pollName = document.createElement("span");
    pollName.setAttribute("class", "pollName");
    pollName.innerHTML = poll.name;
    pollDiv.appendChild(pollName);

    var removePoll = document.createElement("span");
    removePoll.setAttribute("class", "removePoll");
    removePoll.innerHTML = "<a href=\"#\" OnClick=removePoll(" + poll.id + ")>Remove poll</a>";
    pollDiv.appendChild(removePoll);
}


function showNewChoice(pollId, choiceDescription) {
    var poll = document.getElementById(pollId);
    var choice = document.createElement("span");
    choice.setAttribute("class", "choice");
    choice.innerHTML = choiceDescription;
    poll.appendChild(choice);
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

