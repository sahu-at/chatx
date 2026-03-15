const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

/* -------- REGISTER -------- */

router.post("/register", async(req,res)=>{

try{

const {username,email,phone,password} = req.body

/* CHECK EXISTING USER */

const existingUser = await User.findOne({

$or:[
{email},
{phone},
{username}
]

})

if(existingUser){
return res.json({msg:"User already exists"})
}

/* HASH PASSWORD */

const hash = await bcrypt.hash(password,10)

/* CREATE USER */

const user = new User({

username,
email,
phone,
password:hash

})

await user.save()

res.json({
msg:"User created",
user
})

}catch(err){

res.status(500).json({msg:"Register failed"})

}

})

/* -------- LOGIN -------- */

router.post("/login", async(req,res)=>{

try{

const {email,phone,password} = req.body

/* FIND USER */

let user

if(email){

user = await User.findOne({email})

}else if(phone){

user = await User.findOne({phone})

}

if(!user){
return res.json({msg:"User not found"})
}

/* CHECK PASSWORD */

const valid = await bcrypt.compare(password,user.password)

if(!valid){
return res.json({msg:"Wrong password"})
}

/* TOKEN */

const token = jwt.sign(

{ id:user._id, username:user.username },

process.env.JWT_SECRET,

{expiresIn:"7d"}

)

/* RESPONSE */

res.json({

msg:"Login success",
token,
user

})

}catch(err){

res.status(500).json({msg:"Login failed"})

}

})

module.exports = router
