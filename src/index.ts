import Server from './server/server';
import router from './router/router';
import http = require("http");
import socketIo = require("socket.io");
import express = require("express");
import path = require("path");
const expressServer = Server.init(8080);
const server = http.createServer(expressServer.app);
const io = socketIo().listen(server);

expressServer.app.use(router);

io.on('connection', (socket: socketIo.Socket) => {
    console.log("hello!!!");
})
server.listen(8080);