const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const messages = [];

// Declare the messages array at the top levelconst messages = [];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing messages to the newly connected user
    socket.emit('loadMessages', messages);

    // Handle new chat messages
    socket.on('chatMessage', (msg) => {
        // Save the message to the history
        messages.push(msg);

        // Broadcast the message to all connected clients
        io.emit('chatMessage', msg);
    });

    // Handle user joining the chat
    socket.on('joinChat', (username) => {
        socket.username = username;
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
