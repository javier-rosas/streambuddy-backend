import { Socket, Server as SocketIOServer } from "socket.io";

import { ExpressPeerServer } from "peer";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Adjust this to the domain where your extension is running, for security purposes
    methods: ["GET", "POST"],
  },
});

// PeerJS server
const peerServer = ExpressPeerServer(server, {
  // debug: true,
  path: "/",
});

app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.send("Server is running for the Google Meets Clone Extension.");
});

io.on("connection", (socket: Socket) => {
  console.log("connection", socket.id);
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});

// Update this to your desired port, in this case, 2000
server.listen(2000, () => {
  console.log("Server is running on port 2000");
});
