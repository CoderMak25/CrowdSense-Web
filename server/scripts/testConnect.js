const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:5000/ws/live/cst-mumbai');
ws.on('open', () => console.log('Connected ✅'));
ws.on('message', (d) => {
    console.log(new Date().toISOString(), JSON.parse(d));
    process.exit(0); // Exit after first message to not hang the terminal
});
ws.on('error', (e) => {
    console.error('WS Error:', e.message);
    process.exit(1);
});
