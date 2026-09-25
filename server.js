'use strict';

const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
const app = module.exports.app = express();
const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => {
  console.log("Listening on port: " + port);
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  console.log(socket.id);

  //receives the rotation emitter from Client
  socket.on("rotation", (arg) => {
    console.log(arg);
    io.emit('rotationResponse', arg);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

