/**
 * Created by kata on 2017.06.25..
 */

window.onload = init;
var websocketProtocol = "ws";
if (location.protocol.indexOf('https') !== -1) {
    websocketProtocol += "s";
}
var socket = new WebSocket(websocketProtocol+"://" + location.host + "/actions");
socket.onmessage = onMessage;

$(document).ready(function(){
    $(".add-more").click(function(e){
        e.preventDefault();
        var next = $(".choice").length;

        var newIn = '<input autocomplete="off" class="choice" id="field' + next +
            '" name="field' + next + '" type="text">';
        var removeBtn = '<button id="remove' + (next) +
            '" class="btn btn-danger remove-me" >-</button><br/>';
        $("#field").append(newIn).append(removeBtn);


        $('.remove-me').click(function(e){
            e.preventDefault();
            var fieldNum = this.id.charAt(this.id.length-1);
            var fieldID = "#field" + fieldNum;
            $(this).remove();
            $(fieldID).remove();
        });
    });

});

function onMessage(event) {
    var poll = JSON.parse(event.data);
    var pollId = poll.id;
    if (poll.action === "add") {
        showVoterLink(poll.id);
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


function showForm() {
    document.getElementById("addPollForm").style.display = '';
    showChoiceForm();
}

function hideForm() {
    document.getElementById("addPollForm").style.display = "none";
}

function showChoiceForm() {
    document.getElementById("addChoices").style.display = '';
    document.getElementById("doneButton").style.display = '';
}

function hideChoiceForm() {
    document.getElementById("addChoices").style.display = "none";
    document.getElementById("doneButton").style.display = "none";
}

function resetFields() {
    document.getElementById("addPollForm").reset();
    $('.remove-me').remove();
    $('.choice:not(:first)').remove();
    document.getElementById("addChoices").reset();
}

function choiceSubmit(){
    var pollName = document.getElementById("poll_question").value;
    addPoll(pollName);
    $('input.choice').each(function(index, element){
        addChoiceToPoll(pollName, element.value);
    });
    resetFields();
    hideForm();
    hideChoiceForm();
}

function showVoterLink(id){
    var URL = window.location.origin + "/voter/" + id;
    var linkPlace = document.getElementById("link");
    var link = document.createElement("a");
    link.setAttribute("href", URL);
    link.innerHTML = "Click here to see your poll!";
    linkPlace.appendChild(link);
}
function init() {
    hideForm();
    hideChoiceForm();
}

