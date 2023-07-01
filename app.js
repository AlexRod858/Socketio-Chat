const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/');
});
app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let connectedUsers = [];

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
    connectedUsers = connectedUsers.filter(user => user !== socket.userName);
    io.emit('user disconnected', connectedUsers);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('user connected', (userName) => {
    socket.userName = userName;
    connectedUsers.push(userName);
    io.emit('user connected', connectedUsers);
  });

  io.emit('user connected', connectedUsers);
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
