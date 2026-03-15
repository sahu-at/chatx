<!DOCTYPE html>

<html>

<head>
<meta charset="UTF-8">
<title>ChatX</title>
<link rel="stylesheet" href="/css/style.css">
</head>

<body>

<script>
if(!localStorage.getItem("token")){
window.location="/login.html"
}
</script>

<div class="app">

<div class="sidebar">

<div class="sidebar-header">
<h2>ChatX</h2>
<button id="logoutBtn">Logout</button>
</div>

<div id="users"></div>

</div>

<div class="chat">

<div class="chat-header">
<span id="chatWith">Select Chat</span>
<div id="typing"></div>
</div>

<div id="messages"></div>

<div class="chat-input">
<input id="msg" placeholder="Type message">
<button onclick="sendMessage()">Send</button>
</div>

</div>

</div>

<script src="/socket.io/socket.io.js"></script>

<script src="/js/chat.js"></script>

</body>
</html>
