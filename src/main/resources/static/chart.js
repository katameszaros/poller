/**
 * Created by kata on 2017.08.21..
 */

var websocketProtocol = "ws";
if (location.protocol.indexOf('https') !== -1) {
    websocketProtocol += "s";
}
var socket = new WebSocket(websocketProtocol+"://" + location.host + "/actions");
socket.onmessage = onMessage;
socket.onopen = onOpen;

var chart;

function onOpen(event){
    init();
}

function onMessage(event) {
    var poll = JSON.parse(event.data);
    var pollId = poll.id;
    if (poll.action === "getPollDetails") {
        var choices = poll.choices;
        showPollDetails(pollId, choices);
    }
    if (poll.action === "addVoteToPoll") {
        var choices = poll.choices;
        updatePollDetails(choices);
    }
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

function updatePollDetails(choices){
    for (var i = 0; i < choices.length; i++) {
        chart.data.datasets[0].data[i] = choices[i].quantity;
    }
    chart.update();
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
    showChart(choices);
}


function showChart(choices){
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

    chart = new Chart(ctx, {
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

function init() {
    var pathArray = window.location.pathname.split( '/' );
    var pollId = parseInt(pathArray[2]);

    getPollDetails(pollId);
}
