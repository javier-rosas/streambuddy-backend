import { ExpressPeerServer } from "peer";
import { Server as SocketIOServer } from "socket.io";
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
    // many origins are allowed in a list of strings
    origin: [
      "https://www.netflix.com",
      "chrome-extension://emgjobcfmbjoiggclkjkiemgjdmhakfh",
    ],

    // origin: "chrome-extension://emgjobcfmbjoiggclkjkiemgjdmhakfh", // Adjust this to the domain where your extension is running, for security purposes
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

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    console.log("User connected: ", data.userId);
    socket.join(data.userId);
    socket.to(data.userId).emit("user-connected", { peerId: data.peerId });
    console.log("user-connected event emitted");
  });
});

// Update this to your desired port, in this case, 2000
server.listen(2000, () => {
  console.log("Server is running on port 2000");
});
