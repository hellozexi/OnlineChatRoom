import * as express from 'express';
import {Router, Application} from 'express';
import {Server as HttpSercer , createServer} from "http";
import {Socket} from 'socket.io';
import * as  SocketIO from 'socket.io'
import * as path from 'path';


import router from '../router/router';
import {User, Message} from '../model'
import {ChatManager} from "./chatmanager";
import {normalizeSlashes} from "ts-node";


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
                let receiver = this.chat.getUserByName(message[0]);
                let sender = this.chat.getUserByID(socket.id);
                if(receiver === sender) {
                    socket.emit("system", "user can't send message to himself");
                    return;
                }
                socket.to(receiver.socketId).emit("private_msg_to_client", "private(from)" + sender.name + ":" + message[1]);
                socket.emit("private_msg_to_client", "private(to)" + receiver.name + ":" + message[1])
                //console.log("id needed:", user.socketId);
            });

            socket.on('addUser',(username : string) => {
                let user = new User(username, socket.id);
                if(this.chat.hasUserName(username)) {
                    socket.emit("system", "user already exists, refresh this tab and try again");
                    return;
                }
                if(user === undefined) {
                    socket.emit("system", "no user");
                }
                this.chat.login(user);
                socket.join(user.roomname);
                // the event will only be broadcast to clients that have joined the given room
                // (the socket itself being *excluded*).
                socket.broadcast.to(user.roomname).emit("userIn", user.name);
                // the event will only be broadcast to clients that have joined the given room
                // (the socket itself being *excluded*).
                // broadcast current users in the room
                this.io.to("public hall").emit('currentUsers', this.chat.usersInRoom("public hall"));
                socket.emit('updateRooms', this.chat.rooms);
                socket.emit("updatePrivateRooms", this.chat.privateRooms);
                socket.emit("currentRoom", "public hall")
            });
            socket.on("kick", (who_kick : string) => {
                let admin = this.chat.getUserByID(socket.id);
                let user = this.chat.getUserByName(who_kick);

                if(!this.chat.hasUserName(who_kick)) {
                    socket.emit("system", "no user you typed in this room.");
                    return;
                }
                if(user === undefined || admin === undefined || user === null || admin === null) {
                    socket.emit("system", "no user");
                }
                if(admin === user) {
                    socket.emit("system", "You can't do that");
                    return;
                }
                //console.log("kick:" + who_kick);
                if(admin !== null && user !== null && user !== undefined && admin !== undefined){
                    if(this.chat.kickUserOut(admin, user, admin.roomname)) {
                        this.io.to(admin.roomname).emit("currentUsers", this.chat.usersInRoom(admin.roomname));
                        socket.to(user.socketId).emit("currentUsers", this.chat.usersInRoom(user.roomname));
                        socket.emit("currentUsers", this.chat.usersInRoom(admin.roomname));
                        socket.to(user.socketId).emit("currentRoom", user.roomname);
                }
                else {
                    socket.emit("system", "You can't do that");
                }

            }});
            socket.on("ban", (who_ban : string) => {
                console.log("ban:"+  who_ban);
                let admin = this.chat.getUserByID(socket.id);
                let user = this.chat.getUserByName(who_ban);
                if(!this.chat.hasUserName(who_ban)) {
                    socket.emit("system", "no user you typed in this room.");
                    return;
                }
                if(admin === user || admin.roomname == "public hall") {
                    socket.emit("system", "You can't do that");
                }
                if(this.chat.banUser(admin, user, admin.roomname)) {
                    this.io.to(admin.roomname).emit("currentUsers", this.chat.usersInRoom(admin.roomname));
                    socket.to(user.socketId).emit("currentUsers", this.chat.usersInRoom(user.roomname));
                    socket.emit("currentUsers", this.chat.usersInRoom(admin.roomname));
                    socket.to(user.socketId).emit("currentRoom", user.roomname);
                } else {
                    socket.emit("system", "You can't do that");
                }
            })
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
                    socket.emit("currentRoom", user.roomname);
                }
                else {
                    socket.emit('system', 'room name invalid');
                }

            });
            socket.on("switchRoom_withPwd", (response : any) => {
                let user = this.chat.getUserByID(socket.id);
                let oldroom = user.roomname;
                socket.leave(oldroom);
                if(this.chat.switchPrivateRoom(user, response[0], response[1])) {
                    console.log("newRoom_pwd" + user.roomname);
                    socket.join(user.roomname);
                    socket.broadcast.to(user.roomname).emit("currentUsers", this.chat.usersInRoom(user.roomname));
                    socket.broadcast.to(oldroom).emit("currentUsers", this.chat.usersInRoom(oldroom));
                    this.io.to(user.roomname).emit('currentUsers', this.chat.usersInRoom(user.roomname));
                    socket.emit("currentRoom", user.roomname);
                } else {
                    socket.emit('system', 'room name invalid');
                }
            })
            socket.on('addRoom', (roomname: string) => {
                let user = this.chat.getUserByID(socket.id);
                //user is the admin of that room
                if(this.chat.addRoom(user, roomname)) {
                    socket.emit("updateRooms", this.chat.rooms);
                    socket.broadcast.emit("updateRooms", this.chat.rooms);
                } else {
                    socket.emit('system', 'add room failed');
                }

            });
            socket.on("addRoom_withPwd", (response : any) => {
                let user = this.chat.getUserByID(socket.id);
                if(this.chat.addPrivateRoom(user, response[0], response[1])) {
                    console.log("receive" + response[0] + response[1]);
                    socket.emit("updatePrivateRooms", this.chat.privateRooms);
                    socket.broadcast.emit("updatePrivateRooms", this.chat.privateRooms);
                } else {
                    socket.emit("system", "add room failed");
                }

            })
            /*socket.on("disconnect", () => {
                console.log(socket.id);
                let user = this.chat.getUserByID(socket.id);
                console.log('user from socket disconnect');
                console.log(user);
                //socket.leave();
                this.chat.logout(user);
                socket.broadcast.to(user.roomname).emit('currentUsers', this.chat.usersInRoom(user.roomname));
            })*/
        });
    }

    setRouter(router: Router) {
        this.app.use(router);
    }

    setStaticPath(path: string) {
        this.app.use(express.static(path));
    }

}
