import * as express from 'express';
import {Router, Application} from 'express';
import {Server as HttpSercer , createServer} from "http";
import {Socket} from 'socket.io';
import * as  SocketIO from 'socket.io'
import * as path from 'path';


import router from '../router/router';
import {User, Message} from '../model'
import {ChatManager} from "./chatmanager";
import {AddressInfo} from "net";


export class ChatServer {
    private readonly app : Application;
    private readonly server: HttpSercer;
    private readonly chat: ChatManager;
    private io: SocketIO.Server;

    constructor(private port: number) {
        this.app = express();
        this.server = createServer(this.app);
        this.chat = new ChatManager();
        this.initSocket();
        this.configre();
    }

    start() {
        // this._app.listen(this.port, callback);
        this.server.listen(this.port);
    }

    test_start(): string | AddressInfo {
        return this.server.listen().address();
    }

    close() {
        this.io.close();
        this.server.close();
    }

    get express_app(): Application {
        return this.app;
    }

    private configre() {
        this.setRouter(router);
        this.setStaticPath(path.join(__dirname, '..', 'frontend'));
        this.setStaticPath(path.join(__dirname, '..', '..', '..', 'static'));
    }

    private initSocket() {
        this.io = SocketIO().listen(this.server);
        this.io.on('connection', (socket: Socket) => {
            console.log("A new Socket established");

            socket.on('public_msg', (message : Message) => {
                let user = this.chat.getUserByID(socket.id);
                socket.join(user.roomname);
                this.io.sockets.to(user.roomname).emit('public_msg_to_client', user.name + ":" + message);
            });

            socket.on("privateMsg", (message : any) =>{
                //console.log("privateMsg:" + message[0]+ "::::"+ message[1]);
                let receiver = this.chat.getUserByName(message[0]);
                let sender = this.chat.getUserByName(socket.id);
                socket.to(receiver.socketId).emit("private_msg_to_client", "private::" + sender.name + ":" + message[1]);
                //console.log("id needed:", user.socketId);
            })
            socket.on('addUser',(username : string) => {
                console.log(socket.id)
                let user = new User(username, socket.id);
                this.chat.login(user);
                console.log("welcome: " + username);
                socket.join(user.roomname);
                // the event will only be broadcast to clients that have joined the given room
                // (the socket itself being *excluded*).
                socket.broadcast.to(user.roomname).emit("userIn", user.name);
                // the event will only be broadcast to clients that have joined the given room
                // (the socket itself being *excluded*).
                // broadcast current users in the room
                console.log("Which room:" + user.roomname);
                this.io.to(user.roomname).emit('currentUsers', this.chat.usersInRoom(user.roomname));
                //socket.emit('currentUsers', this.chat.usersInRoom(user.roomname));
                socket.emit('updateRooms', this.chat.rooms);
            });

            socket.on('switchRoom', (roomname: string) => {
                let user = this.chat.getUserByID(socket.id);
                console.log("oldRoom:" + user.roomname);
                let oldroom = user.roomname;
                socket.leave(oldroom);
                // if successfully update data
                if (this.chat.switchRoom(user, roomname)) {
                    console.log("newRoom" + user.roomname);
                    socket.join(user.roomname);
                    //socket.join(oldroom);
                    socket.broadcast.to(user.roomname).emit("userIn", user.name);
                    socket.broadcast.to(user.roomname).emit("currentUsers", this.chat.usersInRoom(user.roomname));

                    socket.broadcast.to(oldroom).emit("userOut", user.name);
                    socket.broadcast.to(oldroom).emit("currentUsers", this.chat.usersInRoom(oldroom));

                    this.io.to(user.roomname).emit('currentUsers', this.chat.usersInRoom(user.roomname));
                    //socket.emit("currentUsers", this.chat.usersInRoom(user.roomname));
                }
                else {
                    socket.emit('system', 'room name invalid');
                }

            });

            socket.on('addRoom', (roomname: string) => {
                let user = this.chat.getUserByID(socket.id);
                //user is the admin of that room
                this.chat.addRoom(user, roomname);
                socket.emit("updateRooms", this.chat.rooms);
                socket.broadcast.emit("updateRooms", this.chat.rooms);
            });

            socket.on("disconnect", () => {
                console.log(socket.id);
                let user = this.chat.getUserByID(socket.id);
                socket.leave(user.roomname);
                this.chat.logout(user);
                socket.broadcast.to(user.roomname).emit('currentUsers', this.chat.usersInRoom(user.roomname));
            })
        });
    }

    setRouter(router: Router) {
        this.app.use(router);
    }

    setStaticPath(path: string) {
        this.app.use(express.static(path));
    }

}
