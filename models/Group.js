const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({

name:String,

members:[String],

admin:String,

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Group",groupSchema)