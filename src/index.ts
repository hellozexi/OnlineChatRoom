import ChatServer from './chatserver';
import router from './router/router';
import http = require("http");
import socketIo = require("socket.io");
import path = require("path");
const expressServer = ChatServer.init(8080);
const server = http.createServer(expressServer.app);
const io = socketIo().listen(server);

expressServer.setRouter(router);
expressServer.setStaticPath(path.join(__dirname, 'frontend'));
expressServer.setStaticPath(path.join(__dirname, 'static'));

io.on('connection', (socket: socketIo.Socket) => {
    console.log("Socket established");
    socket.on('message', (message : string)=>{
        console.log(message);
        io.emit('messageFromServer', {message});
    })
})
server.listen(8080);
