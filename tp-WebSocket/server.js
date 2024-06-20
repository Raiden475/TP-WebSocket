const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let currentTicket = 0;
let currentBox = 1;
let lastThreeTickets = [];

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('initialTickets', {
        currentTicket,
        currentBox,
        lastThreeTickets
    });

    socket.on('callTicket', () => {
        currentTicket++;
        const ticket = {
            ticketNumber: currentTicket,
            boxNumber: currentBox
        };

        lastThreeTickets.unshift(ticket);
        if (lastThreeTickets.length > 3) {
            lastThreeTickets.pop();
        }

        io.emit('newTicket', ticket);
        rotateBox();
    });

    socket.on('resetCounter', () => {
        currentTicket = 0;
        currentBox = 1;
        lastThreeTickets = [];
        io.emit('counterReset');
    });

    socket.on('chatMessage', (msg) => {
        console.log('Message received:', msg);
        io.emit('chatMessage', `User: ${msg}`);

        if (msg.toLowerCase() === 'hola') {
            setTimeout(() => {
                socket.emit('chatMessage', 'Bot: ¡Hola! ¿En qué puedo ayudarte hoy?');
                socket.emit('chatMessage', 'Bot: Opciones disponibles:\n1. Saldo de cuenta\n2. Transferencias\n3. Información de productos');
            }, 1000);
        } else if (msg === '1') {
            setTimeout(() => {
                socket.emit('chatMessage', 'Bot: Tu saldo actual es $1,000.');
            }, 1000);
        } else if (msg === '2') {
            setTimeout(() => {
                socket.emit('chatMessage', 'Bot: Para hacer una transferencia, por favor sigue los pasos en nuestra página de transferencias.');
            }, 1000);
        } else if (msg === '3') {
            setTimeout(() => {
                socket.emit('chatMessage', 'Bot: Puedes encontrar información sobre nuestros productos en la sección de productos de nuestro sitio web.');
            }, 1000);
        } else {
            setTimeout(() => {
                socket.emit('chatMessage', 'Bot: Lo siento, no entiendo tu mensaje. Por favor, elige una opción del menú.');
            }, 1000);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server running on port 4000');
});

function rotateBox() {
    currentBox = (currentBox % 3) + 1;
}
