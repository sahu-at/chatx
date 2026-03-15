const express = require("express")
const router = express.Router()

const Status = require("../models/Status")

/* -------- TEST ROUTE -------- */

router.get("/", (req,res)=>{
res.json({msg:"status route working"})
})

/* -------- ADD STATUS -------- */

router.post("/add", async(req,res)=>{

try{

const {userId,image} = req.body

const status = new Status({

userId,
image,
createdAt:new Date()

})

await status.save()

res.json({
msg:"Status added",
status
})

}catch(err){

res.status(500).json({error:"Add status failed"})

}

})

/* -------- GET ALL ACTIVE STATUS -------- */

router.get("/all", async(req,res)=>{

try{

const now=new Date()

const statuses=await Status.find({

createdAt:{
$gte:new Date(now.getTime()-24*60*60*1000)
}

})

res.json(statuses)

}catch(err){

res.status(500).json({error:"Fetch failed"})

}

})

/* -------- GET USER STATUS -------- */

router.get("/user/:userId", async(req,res)=>{

const userId=req.params.userId

try{

const statuses=await Status.find({

userId

})

res.json(statuses)

}catch(err){

res.status(500).json({error:"User status failed"})

}

})

/* -------- VIEW STATUS -------- */

router.post("/view/:id", async(req,res)=>{

const id=req.params.id
const {viewer}=req.body

try{

await Status.updateOne(

{_id:id},
{$addToSet:{views:viewer}}

)

res.json({msg:"Status viewed"})

}catch(err){

res.status(500).json({error:"View failed"})

}

})

/* -------- DELETE STATUS -------- */

router.delete("/delete/:id", async(req,res)=>{

const id=req.params.id

try{

await Status.deleteOne({_id:id})

res.json({msg:"Status deleted"})

}catch(err){

res.status(500).json({error:"Delete failed"})

}

})

module.exports = router
