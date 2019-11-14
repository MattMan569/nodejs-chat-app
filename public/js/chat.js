// eslint-disable-next-line no-undef
const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const input = e.target.elements.message;
    const message = input.value;
    socket.emit('sendMessage', message, () => {
        console.log('The message was delivered!');
    });
    input.value = '';
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    });
});
