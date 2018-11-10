import {ChatServer} from './src/server';


const chatServer = new ChatServer(8080);
chatServer.start();
