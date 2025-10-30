const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

// Serve static files from 'public' folder (if you have it)
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // Generate a random nickname
  const adjectives = ["Fast", "Crazy", "Silent", "Brave", "Happy", "Sneaky", "Cool", "Smart"];
  const animals = ["Tiger", "Panda", "Fox", "Ninja", "Eagle", "Shark", "Robot", "Wolf"];
  const nickname = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}${Math.floor(Math.random() * 100)}`;

  socket.nickname = nickname;
  console.log(`${nickname} connected`);

  // Announce join
  io.emit("chat message", `🟢 ${nickname} joined the chat`);

  socket.on("chat message", (msg) => {
    io.emit("chat message", `${nickname}: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log(`${nickname} disconnected`);
    io.emit("chat message", `🔴 ${nickname} left the chat`);
  });
});

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

