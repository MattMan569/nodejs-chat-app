// eslint-disable-next-line no-undef
const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
// eslint-disable-next-line no-undef
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

socket.on('message', (message) => {
    console.log(message);
    // eslint-disable-next-line no-undef
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        // eslint-disable-next-line no-undef
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', ({room, users}) => {
    // eslint-disable-next-line no-undef
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    });
    document.querySelector('#sidebar').innerHTML = html;
});

socket.on('locationMessage', (message) => {
    console.log(message);
    // eslint-disable-next-line no-undef
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        // eslint-disable-next-line no-undef
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    socket.emit('sendMessage', $messageFormInput.value, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log('Message delivered!');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, () => {
            console.log('Location shared!');
            $sendLocationButton.removeAttribute('disabled');
        });
    });
});

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
