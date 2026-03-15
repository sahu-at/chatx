require("dotenv").config()

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")

const connectDB = require("./config/db")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const messageRoutes = require("./routes/messages")
const statusRoutes = require("./routes/status")
const groupRoutes = require("./routes/groups")

const chatSocket = require("./sockets/chatSocket")

const app = express()

const server = http.createServer(app)

const io = new Server(server)

connectDB()

app.use(express.json())

app.use(express.static("public"))
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});

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

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/status", statusRoutes)
app.use("/api/groups", groupRoutes)

/* -------------------- IMAGE UPLOAD API -------------------- */

app.post("/upload", upload.single("image"), (req, res) => {

res.json({
imageUrl: "/uploads/" + req.file.filename
})

})

/* -------------------- STATIC UPLOADS -------------------- */

app.use("/uploads", express.static("uploads"))


/* -------------------- SOCKET -------------------- */

chatSocket(io)

/* -------------------- SERVER START -------------------- */

server.listen(3000, () => {
console.log("Server running on port 3000")
})