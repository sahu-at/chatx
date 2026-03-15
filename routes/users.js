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

const users = await User.find()

res.json(users)

})

/* -------- SEARCH USER -------- */

router.get("/search/:name", async(req,res)=>{

const name=req.params.name

const users=await User.find({
username:{$regex:name,$options:"i"}
})

res.json(users)

})

/* -------- GET USER BY USERNAME -------- */

router.get("/profile/:username", async(req,res)=>{

const username=req.params.username

const user = await User.findOne({username})

res.json(user)

})

/* -------- PROFILE PHOTO UPLOAD -------- */

router.post("/profile-photo/:username", upload.single("image"), async(req,res)=>{

const username=req.params.username

const imagePath="/uploads/"+req.file.filename

await User.updateOne(
{username},
{profilePic:imagePath}
)

res.json({
msg:"Profile photo updated",
image:imagePath
})

})

module.exports = router