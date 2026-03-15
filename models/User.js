const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

username:String,
email:String,
phone:String,
password:String,

profilePic:{
type:String,
default:""
},

bio:{
type:String,
default:""
},

online:{
type:Boolean,
default:false
},

lastSeen:Date

})

module.exports = mongoose.model("User",userSchema)