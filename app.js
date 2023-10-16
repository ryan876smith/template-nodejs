const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connectedUsers = {};


io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new user connections
  socket.on('new user', (username) => {
    connectedUsers[socket.id] = username;
    io.emit('user list', Object.values(connectedUsers));
  });

  // Handle chat messages
  socket.on('chat message', (message) => {
    const sender = connectedUsers[socket.id];
    io.emit('chat message', { sender, message });
  });

  socket.on('disconnect', () => {
    const username = connectedUsers[socket.id];
    delete connectedUsers[socket.id];
    io.emit('user list', Object.values(connectedUsers));
    console.log(`${username} disconnected`);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
