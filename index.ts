import {
  ALLOWED_ORIGINS,
  MONGO_DATABASE,
  MONGO_HOST,
  MONGO_PASSWORD,
  MONGO_USERNAME,
  PORT,
} from "@/utils/constants";

import { authenticateToken } from "@/middleware/authentication";
import cors from "cors";
import { corsOptionsDelegate } from "@/utils/randomUtils";
import { createServer } from "http";
import express from "express";
import mongoose from "mongoose";
import router from "./routes";

const app = express();
const server = createServer(app);

// Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
  },
});

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use("/api", router);

mongoose
  .connect(
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Routes
app.get("/", (req: any, res: any) => {
  res.send(`Hello World! ${MONGO_USERNAME}`);
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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
