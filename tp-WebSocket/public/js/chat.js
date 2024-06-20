const socket = io();

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = '/';
});

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value;
    if (message.trim()) {
        socket.emit('chatMessage', message);
        input.value = '';
    }
}

socket.on('chatMessage', (message) => {
    const chatBox = document.getElementById('chat-box');
    const p = document.createElement('p');
    p.innerText = message;
    chatBox.appendChild(p);
});
