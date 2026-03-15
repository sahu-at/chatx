require("dotenv").config()

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const cors = require("cors")

const connectDB = require("./config/db")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const messageRoutes = require("./routes/messages")
const statusRoutes = require("./routes/status")
const groupRoutes = require("./routes/groups")

const chatSocket = require("./sockets/chatSocket")

const app = express()

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json())
app.use(cors())

/* -------------------- DATABASE -------------------- */

connectDB()

/* -------------------- SERVER -------------------- */

const server = http.createServer(app)

const io = new Server(server,{
cors:{
origin:"*",
methods:["GET","POST"]
}
})

/* -------------------- CREATE UPLOAD FOLDER -------------------- */

if(!fs.existsSync("uploads")){
fs.mkdirSync("uploads")
}

/* -------------------- STATIC FILES -------------------- */

app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

/* -------------------- HOME PAGE -------------------- */

app.get("/", (req, res) => {
res.sendFile(__dirname + "/public/chat.html")
})

/* -------------------- IMAGE UPLOAD SETUP -------------------- */

const storage = multer.diskStorage({

destination: function (req, file, cb) {
cb(null, "uploads/")
},

filename: function (req, file, cb) {
cb(null, Date.now() + path.extname(file.originalname))
}

})

const upload = multer({ storage })

/* -------------------- IMAGE UPLOAD API -------------------- */

app.post("/upload", upload.single("image"), (req, res) => {

res.json({
imageUrl: "/uploads/" + req.file.filename
})

})

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/status", statusRoutes)
app.use("/api/groups", groupRoutes)

/* -------------------- API HEALTH CHECK -------------------- */

app.get("/api",(req,res)=>{
res.json({msg:"ChatX API running"})
})

/* -------------------- SOCKET -------------------- */

chatSocket(io)

/* -------------------- SERVER START -------------------- */

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
console.log("🚀 ChatX Server running on port",PORT)
})
