const express=require("express")
const router=express.Router()

const Message=require("../models/Message")

/* -------- GET MESSAGES BETWEEN TWO USERS -------- */

router.get("/:sender/:receiver",async(req,res)=>{

const {sender,receiver}=req.params

const messages=await Message.find({

$or:[
{sender,receiver},
{sender:receiver,receiver:sender}
]

})

res.json(messages)

})


/* -------- SEND MESSAGE -------- */

router.post("/send",async(req,res)=>{

const {sender,receiver,message,type}=req.body

const newMessage=new Message({

sender,
receiver,
message,
type:type || "text"

})

await newMessage.save()

res.json(newMessage)

})


/* -------- MARK MESSAGE AS SEEN -------- */

router.put("/seen/:id",async(req,res)=>{

const id=req.params.id

await Message.updateOne(
{_id:id},
{seen:true}
)

res.json({msg:"Message marked as seen"})

})


/* -------- GET UNREAD MESSAGE COUNT -------- */

router.get("/unread/:username",async(req,res)=>{

const username=req.params.username

const count=await Message.countDocuments({
receiver:username,
seen:false
})

res.json({unread:count})

})

module.exports=router