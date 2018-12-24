var socket = io.connect('http://localhost:3000');

// DOM Selection
let message = document.getElementById('message');
let handle = document.getElementById('handle');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let feedback = document.getElementById('feedback');

btn.addEventListener('click', async function () {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        time: Date()
    });
});

message.addEventListener('keypress', async function() {
    socket.emit('typing', handle.value);
});

//Listen for events
socket.on('chat', async function (data) {
   output.innerHTML += `<p><strong>${data.handle}</strong> : ${data.message}<br>${data.time}</p>`;
    feedback.innerText = '';
});

socket.on('typing', async function(data) {
   feedback.innerHTML = `<p><em><strong>${data}</strong> is typing a message</em></p>`;
});