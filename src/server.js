import express      from 'express';
import https         from 'https';
import WebSocket    from 'ws';

import fs           from 'fs';

const app = express();

const option = {
    key : fs.readFileSync(__dirname+'/cert/localhost-key.pem'),
    cert: fs.readFileSync(__dirname+'/cert/localhost.pem')
}

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');
app.use('/public', express.static(__dirname+'/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListening = () => console.log('Listening on https://localhost:3000');

const server  = https.createServer(option, app);
const wss     = new WebSocket.Server({server});
let   sockets = {};

wss.on('connection', (socket, req) => {
    const header = req.headers;
    socket.agent    = header['user-agent'];
    socket.uid      = header['sec-websocket-key'];
    socket.name     = (Number(''+(new Date().getTime())+'001').toString(36).substring(7,10))+(socket.uid.substring(0,4));

    socket.on('close', () => {
        const position = socket.position;
        if(position){
            delete sockets[position][socket.uid];
            wss.clients.forEach(item => item.send(JSON.stringify(
                {
                    list : Object.values(sockets[position]),
                    key  : item.name
                }
            )));
            (Object.values(sockets[position]).length === 0) && (delete sockets[position]);
        }
    });
    socket.on('message', (message) => {
        const data  = JSON.parse(message);

        switch (data.type) {
            case 'GET_POSITION' :
                const msg       = data.name;
                socket.position = msg;
                sockets[msg]    = sockets[msg] ? sockets[msg] : {};
                sockets[msg][socket.uid] = {
                    position : socket.position,
                    name     : socket.name,
                    uid      : socket.uid,
                };
                wss.clients.forEach(item => {
                    const rt = JSON.parse(JSON.stringify(sockets[msg]));
                    delete rt[item.uid];
                    item.send(JSON.stringify({
                        list : Object.values(rt),
                        key  : item.name
                    }));
                });
                break;
        }
    });
});

server.listen(3000, handleListening);