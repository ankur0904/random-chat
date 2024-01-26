import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const users = {};
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static('public', {index: false}));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/public/index.html'));
});

io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  })

  socket.on('send', (message)=>{
    socket.broadcast.emit('receive', {message: message, name: users[socket.id]})    
  })

  socket.on('disconnect', ()=>{
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});