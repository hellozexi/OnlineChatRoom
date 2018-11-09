import { Server } from 'socket.io';
import {Server as HttpSercer } from "http";
import * as  SocketIO from 'socket.io'


export class Socketmanager {
    private readonly io: Server;

    constructor(httpServer: HttpSercer) {
        this.io = SocketIO().listen(httpServer);
    }

    on(event: string, listener: Function) {
        this.io.on(event, listener)
    }
}
