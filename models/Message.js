const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({

sender:String,
receiver:String,

message:String,

type:{
type:String,
default:"text"
},

seen:{
type:Boolean,
default:false
},

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Message",messageSchema)