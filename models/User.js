const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

/* BASIC INFO */

username:{
type:String,
required:true,
unique:true
},

email:String,

phone:String,

password:String,

/* PROFILE */

profilePic:{
type:String,
default:""
},

bio:{
type:String,
default:""
},

about:{
type:String,
default:"Hey there! I am using ChatX"
},

/* CONTACTS */

contacts:{
type:[String],
default:[]
},

/* BLOCKED USERS */

blocked:{
type:[String],
default:[]
},

/* ONLINE STATUS */

online:{
type:Boolean,
default:false
},

lastSeen:{
type:Date,
default:null
},

/* ACCOUNT CREATED */

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("User",userSchema)
