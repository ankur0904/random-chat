const socket = io();
var music = new Audio("../interface-124464.mp3")
const messageContainer = document.getElementById('messages');
const form = document.getElementById('form');
const append = (role, message, position, isMessageReceive) => {
    const messageElement = document.createElement('li');
    messageElement.classList.add('list-group-item');
    messageElement.classList.add('chat-item');
    if(position){
        messageElement.classList.add(`${position}`);
    }else{
        messageElement.classList.add('spark')
    }
    
    const strongElement = document.createElement('strong');
    strongElement.innerText = role+': ';
    
    const messageSpan = document.createElement('span');
    messageSpan.innerText = message;
    
    messageElement.appendChild(strongElement);
    messageElement.appendChild(messageSpan); // Append the message span to the message element
    messageContainer.append(messageElement);
    if(isMessageReceive){
        music.play();
    }
}
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);
socket.on('user-joined', name => {
    append(`${name}`, 'joined the chat');
})
socket.on('receive', (data) => {
    append(`${data.name}`, `${data.message}`, 'left', true);
})
socket.on('left', (name) => {
    append(`${name}`, 'left the chat');
})
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('input').value;
    append('You', `${message}`, 'right');
    socket.emit('send', message);
    document.getElementById('input').value = '';
})