const WebSocketServer = require("websocket").server;
const http = require("http");

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(404);
  res.end();
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Create a WebSocket server
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

// Store all connected clients
const clients = [];

// Handle incoming WebSocket requests
wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  clients.push(connection);
  console.log("New client connected");

  // Broadcast a message to all clients
  const broadcastMessage = (message) => {
    clients.forEach((client) => {
      if (client.connected) {
        client.sendUTF(message);
      }
    });
  };

  // Handle messages from this client
  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log("Received message:", message.utf8Data);
      broadcastMessage(message.utf8Data); // Broadcast the received message
    }
  });

  // Handle client disconnect
  connection.on("close", () => {
    console.log("Client disconnected");
    const index = clients.indexOf(connection);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});
