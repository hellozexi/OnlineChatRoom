import { Server, Socket } from 'socket.io';
import {Server as HttpSercer} from "http";
import * as  SocketIO from 'socket.io'


export class SocketManager {
    private readonly io: Server;

    constructor(httpServer: HttpSercer) {
        this.io = SocketIO().listen(httpServer);
        this.io.on('connection', (socket: Socket) => {
            console.log("Socket established");
            socket.on('message', (message : string) => {
                console.log(message);
                this.io.emit('messageFromServer', {message});
            });
            socket.on('addUser',(message : string) => {
                console.log("welcome: " + message);
                this.io.emit('messageFromServer', {message});
            });
        });
    }
}
