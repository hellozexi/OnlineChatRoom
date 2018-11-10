import path = require("path");


import ChatServer from './src/server/chatserver';
import router from './src/router/router';

const chatServer = new ChatServer(8080);
chatServer.setRouter(router);
chatServer.setStaticPath(path.join(__dirname, './src/frontend'));
chatServer.setStaticPath(path.join(__dirname, '..', 'static'));
chatServer.start();
