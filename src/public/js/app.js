const ws = new WebSocket(`ws://${window.location.host}`);

ws.addEventListener('open', (socket) => {
    console.log('Connection ✅');
});
ws.addEventListener('message', (socket) => {
    console.log(socket.data);
});
ws.addEventListener('close', (socket) => {
    console.log('Connection ❌');
});

const btn = document.querySelector('#send-btn');
const inp = document.querySelector('#input');

btn.addEventListener('click', (e) => {
    ws.send(inp.value);
    inp.value = '';
});