const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } }); // Allow all connections (for now)

app.get("/", (req, res) => {
  res.send("Chat server is running 🐢");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected!");

  // Listen for messages from clients
  socket.on("sendMessage", (msgData) => {
    console.log("Received message:", msgData);
    io.emit("newMessage", msgData); // Broadcast to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
const PORT = 5000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
