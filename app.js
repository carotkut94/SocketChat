const express = require('express');
const Request = require("request");
http = require('http');
app = express();
server = http.createServer(app);

let users = new Map();

io = require('socket.io').listen(server);

io.on('connection', (socket) => {

    /**
     * 1. If user is chatting for the first time, then
     * he/she should be added into the contact list
     * 2. this is the server code, that handles the emission of
     * messages/events and data, which is bidirectional
     */

    socket.on('chat', async function (data) {
        // insert the message in the database
        // emit the message
        // and add the message in the view.
        // io.to(users.get(data.to)).emit('chat', data);

        Request.post({
            "url": "http://localhost/temp_site/home/chat_Ins",
            form: {
                msg: data.message,
                userID: data.to,
                username: data.username,
                user_id: data.from,
                sentby: data.sentby
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            console.log(body);
            Request.post({
                "url": "http://localhost/temp_site/home/get_socket_id",
                form: {
                    user_id: data.to,
                }
            }, (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                io.to(body).emit('chat', data);
                io.to(body).emit('active', data);
                io.to(socket.id).emit('inserted', data.to);
            });
        });
        // $.ajax({
        //     data: {msg: msg, userID: usid, username: usname},
        //     type: "post",
        //     url: "http://localhost/tutordip/home/chat_Ins",
        //
        //     success: function (data) {
        //         // console.log("data");
        //         // alert("Data Save: " + data);
        //     }
        // });
    });

    socket.on('typing', async function (data) {
        // If user starts typing then send the typing event from client to the
        // chatting client
        console.log(data.to);
        console.log(data.from);
        console.log(data.message);
        Request.post({
            "url": "http://localhost/temp_site/home/get_socket_id",
            form: {
                user_id: data.to,
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            io.to(body).emit('typing', data);
        });
    });

    socket.on('active', async function (data) {
        // If user starts typing then send the typing event from client to the
        // chatting client
        console.log(data.to);
        console.log(data.from);
        Request.post({
            "url": "http://localhost/temp_site/home/get_socket_id",
            form: {
                user_id: data.to,
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            io.to(body).emit('active', data);
        });
    });


    socket.on("register", async function (data) {
        // Whenever a user gets connected he/she register via calling
        // this event,
        // on this even need to set the user as online
        // and call the refresh event so that user can refresh the online user
        // list
        console.log(socket.id + "======>" + data);
        users.set(data, socket.id);
        socket.broadcast.emit("refresh", users);
        Request.post({
            "url": "http://localhost/temp_site/home/socket_status",
            form: {
                socket_id: socket.id,
                user_id: data,
                status: 'online'
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            console.log(body);
        });
    });

    socket.on('disconnect', async function (reason) {
        // Whenever user is disconnected remove set user status in database
        // and emit refresh event
        console.log(reason);
        console.log(socket.id);
        socket.broadcast.emit("refresh", users);
        Request.post({
            "url": "http://localhost/temp_site/home/socket_offline",
            form: {
                socket_id: socket.id,
                status: 'offline'
            }
        }, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            console.log(body);
        });
    });

});

server.listen(3000, () => {
    console.log('Node app is running on port 3000');
});


// static file
app.use(express.static('public'));
