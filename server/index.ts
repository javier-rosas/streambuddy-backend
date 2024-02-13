import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
dotenv.config();

const app = express();
app.use(cors());

app.get("/api/", (req, res) => {
  res.json({ message: "Your API is working!" });
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join room", (roomID: string) => {
    socket.join(roomID);
    const otherUsers = io.sockets.adapter.rooms.get(roomID);
    if (otherUsers && otherUsers.size > 1) {
      socket.to(roomID).emit(
        "all users",
        Array.from(otherUsers).filter((id) => id !== socket.id)
      );
    }
  });

  socket.on(
    "sending signal",
    (payload: { userToSignal: string; signal: any; callerID: string }) => {
      io.to(payload.userToSignal).emit("user joined", {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    }
  );

  socket.on(
    "returning signal",
    (payload: { callerID: string; signal: any }) => {
      io.to(payload.callerID).emit("receiving returned signal", {
        signal: payload.signal,
        id: socket.id,
      });
    }
  );
});

const PORT: number | string = process.env.PORT || 2000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
