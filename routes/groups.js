const express = require("express")
const router = express.Router()

const Group = require("../models/Group")

/* -------- CREATE GROUP -------- */

router.post("/create", async (req,res)=>{

const {name,admin,members}=req.body

try{

const group=new Group({

name,
admin,
members:[admin,...members]

})

await group.save()

res.json(group)

}catch(err){

res.status(500).json({error:"Group create failed"})

}

})

/* -------- GET GROUPS OF USER -------- */

router.get("/user/:username", async (req,res)=>{

const username=req.params.username

try{

const groups=await Group.find({

members:username

})

res.json(groups)

}catch(err){

res.status(500).json({error:"Fetch groups failed"})

}

})

/* -------- ADD MEMBER -------- */

router.put("/add-member/:groupId", async (req,res)=>{

const groupId=req.params.groupId
const {member}=req.body

try{

await Group.updateOne(

{_id:groupId},
{$addToSet:{members:member}}

)

res.json({msg:"Member added"})

}catch(err){

res.status(500).json({error:"Add member failed"})

}

})

/* -------- REMOVE MEMBER -------- */

router.put("/remove-member/:groupId", async (req,res)=>{

const groupId=req.params.groupId
const {member}=req.body

try{

await Group.updateOne(

{_id:groupId},
{$pull:{members:member}}

)

res.json({msg:"Member removed"})

}catch(err){

res.status(500).json({error:"Remove member failed"})

}

})

/* -------- DELETE GROUP -------- */

router.delete("/:groupId", async (req,res)=>{

try{

await Group.deleteOne({_id:req.params.groupId})

res.json({msg:"Group deleted"})

}catch(err){

res.status(500).json({error:"Delete failed"})

}

})

module.exports = router
