const express = require("express")
const router = express.Router()
const User = require("../models/User")
const multer = require("multer")
const path = require("path")

/* -------- IMAGE STORAGE -------- */

const storage = multer.diskStorage({

destination: function(req,file,cb){
cb(null,"uploads/")
},

filename: function(req,file,cb){
cb(null,Date.now()+path.extname(file.originalname))
}

})

const upload = multer({storage})

/* -------- GET ALL USERS -------- */

router.get("/", async (req,res)=>{

try{

const users = await User.find()

res.json(users)

}catch(err){

res.status(500).json({error:"Failed to fetch users"})

}

})

/* -------- SEARCH USER -------- */

router.get("/search/:name", async(req,res)=>{

const name=req.params.name

try{

const users=await User.find({
username:{$regex:name,$options:"i"}
})

res.json(users)

}catch(err){

res.status(500).json({error:"Search failed"})

}

})

/* -------- GET USER PROFILE -------- */

router.get("/profile/:username", async(req,res)=>{

const username=req.params.username

try{

const user = await User.findOne({username})

res.json(user)

}catch(err){

res.status(500).json({error:"Profile fetch failed"})

}

})

/* -------- PROFILE PHOTO UPLOAD -------- */

router.post("/profile-photo/:username", upload.single("image"), async(req,res)=>{

const username=req.params.username

try{

const imagePath="/uploads/"+req.file.filename

await User.updateOne(
{username},
{profilePic:imagePath}
)

res.json({
msg:"Profile photo updated",
image:imagePath
})

}catch(err){

res.status(500).json({error:"Upload failed"})

}

})

/* -------- UPDATE BIO / ABOUT -------- */

router.put("/bio/:username", async(req,res)=>{

const username=req.params.username
const {bio,about}=req.body

try{

await User.updateOne(
{username},
{bio,about}
)

res.json({msg:"Profile updated"})

}catch(err){

res.status(500).json({error:"Update failed"})

}

})

/* -------- ADD CONTACT -------- */

router.put("/add-contact/:username", async(req,res)=>{

const username=req.params.username
const {contact}=req.body

try{

await User.updateOne(
{username},
{$addToSet:{contacts:contact}}
)

res.json({msg:"Contact added"})

}catch(err){

res.status(500).json({error:"Add contact failed"})

}

})

/* -------- BLOCK USER -------- */

router.put("/block/:username", async(req,res)=>{

const username=req.params.username
const {blockedUser}=req.body

try{

await User.updateOne(
{username},
{$addToSet:{blocked:blockedUser}}
)

res.json({msg:"User blocked"})

}catch(err){

res.status(500).json({error:"Block failed"})

}

})

/* -------- USER ONLINE STATUS -------- */

router.get("/status/:username", async(req,res)=>{

const username=req.params.username

try{

const user=await User.findOne({username})

res.json({
online:user.online,
lastSeen:user.lastSeen
})

}catch(err){

res.status(500).json({error:"Status fetch failed"})

}

})

module.exports = router
