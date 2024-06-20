const socket = io();

const callButton = document.getElementById('call-ticket');
const resetButton = document.getElementById('reset-button');
const mainScreenTitle = document.getElementById('main-screen-title');
const currentTicketLeft = document.getElementById('current-ticket-left');
const currentBoxLeft = document.getElementById('current-box-left');
const smallDisplays = [
    { ticket: document.getElementById('current-ticket-1'), box: document.getElementById('current-box-1') },
    { ticket: document.getElementById('current-ticket-2'), box: document.getElementById('current-box-2') },
    { ticket: document.getElementById('current-ticket-3'), box: document.getElementById('current-box-3') }
];

let lastThreeTickets = [];
const sound = new Audio('/sounds/sound.mp3'); // Carga el archivo de sonido

callButton.addEventListener('click', () => {
    socket.emit('callTicket');
});

resetButton.addEventListener('click', () => {
    socket.emit('resetCounter');
});

socket.on('newTicket', (ticket) => {
    lastThreeTickets.unshift(ticket);
    if (lastThreeTickets.length > 3) {
        lastThreeTickets.pop();
    }
    updateDisplays();
    sound.currentTime = 0; // Reinicia el sonido al principio
    sound.play(); // Reproduce el sonido al llamar un nuevo ticket
});

function updateDisplays() {
    if (lastThreeTickets.length > 0) {
        const latestTicket = lastThreeTickets[0];
        mainScreenTitle.innerText = 'NUEVO TURNO';
        currentTicketLeft.innerText = `TURNO ${latestTicket.ticketNumber}`;
        currentBoxLeft.innerText = `BOX ${latestTicket.boxNumber}`;
    } else {
        mainScreenTitle.innerText = 'NUEVO TURNO';
        currentTicketLeft.innerText = 'TURNO -';
        currentBoxLeft.innerText = 'BOX -';
    }

    smallDisplays.forEach((display, index) => {
        if (lastThreeTickets[index]) {
            display.ticket.innerText = lastThreeTickets[index].ticketNumber;
            display.box.innerText = lastThreeTickets[index].boxNumber;
        } else {
            display.ticket.innerText = '-';
            display.box.innerText = '-';
        }
    });
}

socket.on('counterReset', () => {
    lastThreeTickets = [];
    updateDisplays();
});

socket.on('initialTickets', (data) => {
    lastThreeTickets = data.lastThreeTickets;
    updateDisplays();
});

document.getElementById('chat-button').addEventListener('click', () => {
    window.location.href = '/chat.html';
});
