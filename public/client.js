// invoke io 
var socket = io();
// connect io to localhost:3000
socket.connect("http://localhost:3000");
// get elements
var mainHeader = document.getElementById("main-header"),
    userForm = document.getElementById("user-form"),
    // elem to print errors in entering nicknames
    nickErr = document.getElementById("user-err"),
    // elem to hold all nicks
    nickElem = document.getElementById("nicks"),
    userInput = document.getElementById("user-input"),
    // elem to show and hide nick form
    userWrapper = document.getElementById("user-wrapper"),
    // chat elems
    chatForm = document.getElementById("chat-form"),
    chatInput = document.getElementById("chat-input"),
    chatBox = document.getElementById("chat-box"),
    chatMsg = document.getElementById("chat-msg"),
    chatContent = document.getElementById("chat-container"),
    chatWrapper = document.getElementById("chat-wrapper");
// bind nicknames event handler
userForm.addEventListener("submit", function(e) {
    e = e || event; // work-around for IE
    e.preventDefault();
    // emit join event  to server with user input and callback 
    socket.emit("join", userInput.value, function(isNickAvailable) {
        if (isNickAvailable) {
            // hide username input area
            userWrapper.style.display = "none";
            // clear welcome message
            mainHeader.innerHTML = "";
            // start the chat page
            chatWrapper.style.display = "block";
        } else {
            nickErr.innerHTML = "Nick already taken, please select another name";
        }
    });
    userInput.value = "";
});
// listen for nicks event and display nicknames
socket.on("nicks", function(nicks) {
    var i, len = nicks.length,
        str = "";
    for (i = 0; i < len; i += 1) {
        // delimit strings into multiple lines
        str += nicks[i] + "</br>";
    }
    nickElem.innerHTML = str;
});
// bind chat messages event handler
chatForm.addEventListener("submit", function(event) {
    event.preventDefault();
    // emit messages event to server
    socket.emit("messages", chatInput.value);
    chatInput.value = "";
});
// helper function to display messages
function addMsg(data) {
        chatMsg.innerHTML += ("<i>" + data.user + ": </i>" + data.msg + "</br>");
    }
// listen for new messages event from server
socket.on("new messages", function(data) {
    addMsg(data);
});
// listen for old messages event from server
socket.on("old msg", function(data) {
    var i, len = data.length;
    for (i = 0; i < len; i += 1) {
        addMsg(data[i]);
    }
});