const Message = require("../models/Message")
const User = require("../models/User")

let users = {}

function chatSocket(io){

io.on("connection",(socket)=>{

console.log("User connected")

/* -------- USER JOIN -------- */

socket.on("join", async (username)=>{

users[socket.id] = username

// update online status
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
type:data.type || "text"
})

await msg.save()

io.emit("receiveMessage",msg)

})

/* -------- USER DISCONNECT -------- */

socket.on("disconnect", async ()=>{

let username = users[socket.id]

delete users[socket.id]

// update last seen
await User.updateOne(
{username},
{
online:false,
lastSeen:new Date()
}
)

io.emit("onlineUsers",Object.values(users))

})

})

}

module.exports = chatSocket