const express = require("express")
const router = express.Router()

const Status = require("../models/Status")


/* -------- TEST ROUTE -------- */

router.get("/", (req,res)=>{
res.json({msg:"status route working"})
})


/* -------- ADD STATUS -------- */

router.post("/add", async(req,res)=>{

const {userId,image} = req.body

const status = new Status({
userId,
image
})

await status.save()

res.json({
msg:"Status added",
status
})

})


/* -------- GET ALL STATUS -------- */

router.get("/all", async(req,res)=>{

const statuses = await Status.find()

res.json(statuses)

})


/* -------- GET USER STATUS -------- */

router.get("/user/:userId", async(req,res)=>{

const userId=req.params.userId

const statuses=await Status.find({userId})

res.json(statuses)

})


/* -------- DELETE STATUS -------- */

router.delete("/delete/:id", async(req,res)=>{

const id=req.params.id

await Status.deleteOne({_id:id})

res.json({msg:"Status deleted"})

})


module.exports = router