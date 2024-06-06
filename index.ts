import {
  ALLOWED_ORIGINS,
  MONGO_DATABASE,
  MONGO_HOST,
  MONGO_PASSWORD,
  MONGO_USERNAME,
  PORT,
} from "@/utils/constants";

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
app.use("/", router);

mongoose
  .connect(
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Socket.io events
io.on("connection", (socket: any) => {
  // Log user connection
  console.log("User connected:", socket.id);
  // Join room
  socket.on("join-room", (data: any) => {
    console.log("data", data);
    const { link } = data;
    socket.join(link);
    console.log(`User ${socket.id} joined room ${link}`);

    // Notify other users in the room that a new user has connected
    socket.to(link).emit("user-connected", { link });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("offer", (data: any) => {
    const { link, offer } = data;
    socket.to(link).emit("offer", { link, offer });
  });

  socket.on("answer", (data: any) => {
    const { link, answer } = data;
    socket.to(link).emit("answer", { link, answer });
  });

  socket.on("ice-candidate", (data: any) => {
    const { link, candidate } = data;
    socket.to(link).emit("ice-candidate", { link, candidate });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
