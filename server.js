const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/public"));
const clients = new Map();

io.on("connection", (socket) => {
  console.log("Felhasználó csatlakozott:", socket.id);

  // Listen for the 'set-user' event on the specific socket
  socket.on("set-user", (name) => {
    clients.set(socket.id, name);
    io.emit("chat message", `${name} joined the chat!`);
  });

  socket.on("chat message", (msg) => {
    console.log("Üzenet:", msg);
    io.emit("chat message", clients.get(socket.id) + ": " + msg);
  });

  socket.on("disconnect", () => {
    console.log("Felhasználó lecsatlakozott:", socket.id);
    // Optionally, you can remove the user from clients when they disconnect
    clients.delete(socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen`);
});
