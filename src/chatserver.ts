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
// import express = require("express");
import * as express from 'express';
import * as socketIo from 'socket.io';

import {Router, Application} from 'express';
export default class ChatServer {
    private readonly _app : Application;

    constructor(private port: number) {
        this._app = express();
    }

    get app(): Application {
        return this._app;
    }

    start(callback ?: Function) {
        this._app.listen(this.port, callback);
    }

    setRouter(router: Router) {
        this._app.use(router);
    }

    setStaticPath(path: string) {
        this._app.use(express.static(path));
    }

    static init(port: number) : ChatServer{
        return new ChatServer(port);
    }
}
