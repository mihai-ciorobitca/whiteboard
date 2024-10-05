const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

// Create Express app
const app = express();
const server = http.createServer(app);  // Create HTTP server
const io = socketIO(server);  // Socket.IO setup

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Define the directory for EJS views

// Serve the index.ejs file on the root route
app.get('/', (req, res) => {
    res.render('index');  // Rendering index.ejs
});

// Listen for socket connection events
io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen for draw_event from the client
    socket.on('draw_event', (data) => {
        console.log("draw event");
        io.emit('broadcast_draw', data);  // Broadcast draw event to all clients including the sender
    });

    // Listen for clear_canvas event
    socket.on('clear_canvas', () => {
        io.emit('broadcast_clear');  // Broadcast clear event to all clients
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
