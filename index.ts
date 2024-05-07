/**
 * Description: This file contains the server code for the video chat application.
 * It uses Express.js and Socket.io to create a server that allows users to connect to each other and share video streams.
 */

// Import dependencies
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { authenticateToken } = require("./middleware/authentication");

// Load dotenv
require("dotenv").config();

// Constants
const port = process.env.PORT || 2000;
const JWT_SECRET = process.env.JWT_SECRET;
const NETFLIX_URL = process.env.NETFLIX_URL;
const CHROME_EXTENSION_URL = process.env.CHROME_EXTENSION_URL;

const ALLOWED_ORIGINS = [NETFLIX_URL, CHROME_EXTENSION_URL];

// Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
  },
});

// CORS Middleware to handle multiple allowed origins
const corsOptionsDelegate = function (req: any, callback: any) {
  var corsOptions;
  if (ALLOWED_ORIGINS.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // Reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // Disable CORS for this request
  }
  callback(null, corsOptions); // Callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));
app.use(express.json());

// Routes
app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

app.post("/authenticate", (req: any, res: any) => {
  const user = req.body;
  if (!user) {
    return res.status(400).json({ error: "User data is required" });
  }

  // Ideally, you should validate the user data against your database here
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ jwt: token });
});

// Example of a protected route
app.get("/protected", authenticateToken, (req: any, res: any) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Socket.io events
io.on("connection", (socket: any) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (data: any) => {
    const { userId } = data;
    socket.join(userId);
    console.log(`User ${socket.id} joined room ${userId}`);

    // Notify other users in the room that a new user has connected
    socket.to(userId).emit("user-connected", { userId: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("offer", (data: any) => {
    const { userId, offer } = data;
    socket.to(userId).emit("offer", { userId: socket.id, offer });
  });

  socket.on("answer", (data: any) => {
    const { userId, answer } = data;
    socket.to(userId).emit("answer", { userId: socket.id, answer });
  });

  socket.on("ice-candidate", (data: any) => {
    const { userId, candidate } = data;
    socket.to(userId).emit("ice-candidate", { userId: socket.id, candidate });
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
