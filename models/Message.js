const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({

/* SENDER / RECEIVER */

sender:{
type:String,
required:true
},

receiver:{
type:String,
required:true
},

/* MESSAGE CONTENT */

message:{
type:String,
default:""
},

/* MESSAGE TYPE */

type:{
type:String,
default:"text"   // text, image, voice, file
},

/* MESSAGE STATUS */

status:{
type:String,
default:"sent"   // sent, delivered, seen
},

/* OLD SEEN FIELD (BACKWARD SUPPORT) */

seen:{
type:Boolean,
default:false
},

/* REPLY MESSAGE */

replyTo:{
type:String,
default:null
},

/* MESSAGE EDIT */

edited:{
type:Boolean,
default:false
},

/* MESSAGE DELETE */

deleted:{
type:Boolean,
default:false
},

/* TIME */

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Message",messageSchema)
