const socket = io();

socket.on('ticketStatus', ({ attendedTickets }) => {
    updateAttendedTickets(attendedTickets);
});

socket.on('attendedTicket', ({ attendedTickets }) => {
    updateAttendedTickets(attendedTickets);
});

function updateAttendedTickets(attendedTickets) {
    const attendedTicketsUl = document.getElementById('attended-tickets');
    attendedTicketsUl.innerHTML = '';
    Object.keys(attendedTickets).forEach(date => {
        const li = document.createElement('li');
        li.innerText = `${date}: ${attendedTickets[date]} tickets`;
        attendedTicketsUl.appendChild(li);
    });
}
