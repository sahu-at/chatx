const Message = require("../models/Message")
const User = require("../models/User")

let users = {}

function chatSocket(io){

io.on("connection",(socket)=>{

console.log("User connected")

/* -------- USER JOIN -------- */

socket.on("join", async (username)=>{

users[socket.id] = username

await User.updateOne(
{username},
{online:true}
)

io.emit("onlineUsers",Object.values(users))

})

/* -------- TYPING INDICATOR -------- */

socket.on("typing",(data)=>{

socket.broadcast.emit("typing",data)

})

/* -------- SEND MESSAGE -------- */

socket.on("sendMessage", async (data)=>{

const msg = new Message({

sender:data.sender,
receiver:data.receiver,
message:data.message,
type:data.type || "text",
status:"sent",
createdAt:new Date()

})

await msg.save()

/* SEND TO RECEIVER */

io.emit("receiveMessage",msg)

/* UPDATE STATUS DELIVERED */

msg.status="delivered"

await msg.save()

io.emit("messageDelivered",{
id:msg._id
})

})

/* -------- MESSAGE SEEN -------- */

socket.on("messageSeen", async (data)=>{

await Message.updateOne(
{_id:data.id},
{status:"seen"}
)

io.emit("messageSeen",data)

})

/* -------- USER DISCONNECT -------- */

socket.on("disconnect", async ()=>{

let username = users[socket.id]

delete users[socket.id]

if(username){

await User.updateOne(
{username},
{
online:false,
lastSeen:new Date()
}
)

}

io.emit("onlineUsers",Object.values(users))

})

})

}

module.exports = chatSocket
