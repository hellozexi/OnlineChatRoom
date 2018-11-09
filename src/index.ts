import path = require("path");


import ChatServer from './chatserver';
import router from './router/router';


const chatServer = new ChatServer(8080);
chatServer.setRouter(router);
chatServer.setStaticPath(path.join(__dirname, 'frontend'));
chatServer.setStaticPath(path.join(__dirname, 'static'));
chatServer.start();
