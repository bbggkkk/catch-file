import express      from 'express';
import http         from 'http';
import WebSocket    from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');
app.use('/public', express.static(__dirname+'/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListening = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss    = new WebSocket.Server({server});

wss.on('connection', (socket) => {
    socket.on('close', () => {
        console.log('disconnected from client');
    });
    socket.on('message', (message) => {
        const msg = message.toString();
        socket.send('server recieved :: '+msg)
    });
});

server.listen(3000, handleListening);