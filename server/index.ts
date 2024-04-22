const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "https://www.netflix.com",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");

const port = process.env.PORT || 2000;

app.use(
  cors({
    origin: "https://www.netflix.com",
    methods: ["GET", "POST"],
  })
);

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

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
