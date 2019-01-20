let userName = prompt("Enter a username to register with");
let socket = io.connect('http://localhost:3000');
// DOM Selection
let message = document.getElementById('message');
let handle = document.getElementById('handle');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let feedback = document.getElementById('feedback');

handle.value = userName

btn.addEventListener('click', async function () {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        time: Date(),
        to: prompt("Enter username to send in the message"),
    });
    output.innerHTML += `<p><strong>${handle.value}</strong> : ${message.value}<br>${Date()}</p>`;
});

message.addEventListener("keypress", async function () {
    socket.emit('typing', {
        message: userName+" is typing...",
        to: prompt("Enter username to typing marker"),
    });
});

socket.on('connect', async function () {
    console.log("Connected");
    socket.emit("register",{
        key:userName,
        value:socket.id
    });
});



//Listen for events
socket.on('chat', async function (data) {
    output.innerHTML += `<p><strong>${data.handle}</strong> : ${data.message}<br>${data.time}</p>`;
    feedback.innerText = '';
});

//Listen for typing event
socket.on('typing', async function (data) {
    feedback.innerHTML = `<p><strong>${data.message}</strong></p>`;
});

//Listen for refresh even
socket.on('refresh', async function (data) {
    console.log("refresh called");
    for(let user in data){
        if(data.hasOwnProperty(user)){
            console.log(user.key + " Username " + user.value);
        }
    }
});

