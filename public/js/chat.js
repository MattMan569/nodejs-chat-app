// eslint-disable-next-line no-undef
const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const input = document.querySelector('#message');
    socket.emit('sendMessage', input.value);
    input.value = '';
});
