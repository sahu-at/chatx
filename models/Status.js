const mongoose = require("mongoose")

const statusSchema = new mongoose.Schema({

userId:String,

image:String,

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Status",statusSchema)