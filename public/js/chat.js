const socket = io()

let currentUser = "user1"
let currentChat = ""


// JOIN SOCKET
socket.emit("join", currentUser)



function loadUsers(){

fetch("/api/users")
.then(res=>res.json())
.then(data=>{

let usersDiv=document.getElementById("users")

usersDiv.innerHTML=""

data.forEach(u=>{

let div=document.createElement("div")

/* ----- PROFILE PHOTO ----- */

let img=document.createElement("img")
img.src=u.profilePic || "/default.png"
img.style.width="30px"
img.style.height="30px"
img.style.borderRadius="50%"
img.style.marginRight="10px"

/* ----- USERNAME ----- */

let span=document.createElement("span")
span.innerText=u.username

div.appendChild(img)
div.appendChild(span)

div.onclick=()=>openChat(u.username)

usersDiv.appendChild(div)

})

})

}



function openChat(username){

currentChat=username

document.getElementById("chatWith").innerText=username

fetch(`/api/messages/${currentUser}/${username}`)
.then(res=>res.json())
.then(data=>{

let chat=document.getElementById("messages")

chat.innerHTML=""

data.forEach(m=>{

let div=document.createElement("div")

/* ----- IMAGE MESSAGE ----- */

if(m.type==="image"){

let img=document.createElement("img")
img.src=m.message
img.style.width="150px"

div.appendChild(img)

}else{

div.innerText=m.message

}

chat.appendChild(div)

})

})

}



function sendMessage(){

let input=document.getElementById("msg")

let msg=input.value

socket.emit("sendMessage",{

sender:currentUser,
receiver:currentChat,
message:msg,
type:"text"

})

input.value=""

}



/* ----- RECEIVE MESSAGE ----- */

socket.on("receiveMessage",(data)=>{

if(data.receiver===currentUser || data.sender===currentUser){

let div=document.createElement("div")

if(data.type==="image"){

let img=document.createElement("img")
img.src=data.message
img.style.width="150px"

div.appendChild(img)

}else{

div.innerText=data.message

}

document.getElementById("messages").appendChild(div)

}

})



/* ----- TYPING INDICATOR ----- */

document.getElementById("msg").addEventListener("input",()=>{

socket.emit("typing",{
user:currentUser
})

})


socket.on("typing",(data)=>{

let typingDiv=document.getElementById("typing")

typingDiv.innerText=data.user+" is typing..."

setTimeout(()=>{

typingDiv.innerText=""

},1000)

})



/* ----- ONLINE USERS ----- */

socket.on("onlineUsers",(data)=>{

console.log("Online Users:",data)

})



loadUsers()