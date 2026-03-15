const express=require("express")
const router=express.Router()

const Message=require("../models/Message")

/* -------- GET MESSAGES BETWEEN TWO USERS -------- */

router.get("/:sender/:receiver",async(req,res)=>{

const {sender,receiver}=req.params

try{

const messages=await Message.find({

$or:[
{sender,receiver},
{sender:receiver,receiver:sender}
]

}).sort({createdAt:1})

res.json(messages)

}catch(err){

res.status(500).json({error:"Failed to load messages"})

}

})

/* -------- SEND MESSAGE -------- */

router.post("/send",async(req,res)=>{

const {sender,receiver,message,type}=req.body

try{

const newMessage=new Message({

sender,
receiver,
message,
type:type || "text",
status:"sent"

})

await newMessage.save()

res.json(newMessage)

}catch(err){

res.status(500).json({error:"Send message failed"})

}

})

/* -------- MARK MESSAGE AS SEEN -------- */

router.put("/seen/:id",async(req,res)=>{

const id=req.params.id

try{

await Message.updateOne(
{_id:id},
{
seen:true,
status:"seen"
}
)

res.json({msg:"Message marked as seen"})

}catch(err){

res.status(500).json({error:"Seen update failed"})

}

})

/* -------- DELETE MESSAGE -------- */

router.delete("/:id",async(req,res)=>{

try{

await Message.updateOne(
{_id:req.params.id},
{deleted:true}
)

res.json({msg:"Message deleted"})

}catch(err){

res.status(500).json({error:"Delete failed"})

}

})

/* -------- EDIT MESSAGE -------- */

router.put("/edit/:id",async(req,res)=>{

const {message}=req.body

try{

await Message.updateOne(
{_id:req.params.id},
{
message,
edited:true
}
)

res.json({msg:"Message edited"})

}catch(err){

res.status(500).json({error:"Edit failed"})

}

})

/* -------- GET UNREAD MESSAGE COUNT -------- */

router.get("/unread/:username",async(req,res)=>{

const username=req.params.username

try{

const count=await Message.countDocuments({

receiver:username,
status:{$ne:"seen"}

})

res.json({unread:count})

}catch(err){

res.status(500).json({error:"Unread count failed"})

}

})

module.exports=router
