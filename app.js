const express = require('express');

http = require('http');
app = express();
server = http.createServer(app);

io = require('socket.io').listen(server);

io.on('connection', (socket) =>{
   console.log('user connected', socket.id) ;
   socket.on('join', function (userName) {
       console.log(userName+" has joined the chat");
       socket.broadcast.emit('userjoinedthechat',userName+" has joined the chat");
   });
   socket.on('chat', async function(data) {
       console.log(data)
       io.sockets.emit('chat',data);
   })

    socket.on('typing', async function(data) {
        socket.broadcast.emit('typing', data);
    })
});

server.listen(3000, ()=>{
   console.log('Node app is running on port 3000');
});


// static file
app.use(express.static('public'))