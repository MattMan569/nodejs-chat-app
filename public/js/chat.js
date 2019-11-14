// eslint-disable-next-line no-undef
const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const input = e.target.elements.message;
    const message = input.value;
    socket.emit('sendMessage', message);
    input.value = '';
});
