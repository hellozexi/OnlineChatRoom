/*
import http = require("http");
import socketIo = require("socket.io");
import express = require("express");
import path = require("path");


const app = express();

app.set("port", process.env.PORT || 3000);
// set up socket.io and bind it to our
// http server
// .
app.get('/', (req: any, res: any) => {
    res.sendFile(path.resolve('./www/www.html'));
});

const server = http.createServer(app);
const io = socketIo.listen(server);


// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on('connection', function(socket: any){
    console.log('a user connected');
});
*/
import express = require("express");
export default class Server {
    public app : express.Application;
    constructor(private port: number) {
        this.app = express();
    }
    start(callback ?: Function) {
        this.app.listen(this.port, callback);
    }
    static init(port: number) : Server{
        return new Server(port);
    }
}
