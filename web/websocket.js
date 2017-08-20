/**
 * Created by kata on 2017.06.25..
 */

window.onload = init;
var socket = new WebSocket("ws://localhost:8080/poller_war_exploded/actions");
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


/*var link = document.createElement("a");
link.setAttribute("href", "javascript:;");
link.setAttribute("onclick", "getPollDetails("+ poll.id + ")");
link.setAttribute("id", poll.id);
stileDiv.appendChild(link);*/


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
    showChart(pollId, choices);
}

function showChart(pollId, choices){
    var option = {
        responsive: true
    };

    var labels = [];
    for (var i = 0; i < choices.length; i++) {
        labels[i] = choices[i].description;
    }

    var data = [];
    for (var i = 0; i < choices.length; i++) {
        data[i] = choices[i].quantity;
    }


    var ctx = document.getElementById("myChart").getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Votes',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
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
    var URL = window.location.href + "/voter/" + id;
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

