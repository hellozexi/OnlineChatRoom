import {ChatRoom, User} from "../model";
import {Socket} from "socket.io";

export class ChatManager {
    private readonly chatRooms: {[key: string]: ChatRoom; };
    private readonly onlineUsers: {[key: string]: User; };

    constructor() {
        this.chatRooms = {};
        this.onlineUsers = {};

        this.chatRooms['public hall'] = new ChatRoom('public hall', null)
    }

    get rooms(): {[key: string]: ChatRoom; } {
        return this.chatRooms;
    }

    usersInRoom(roomname: string): User[] {
        let result: User[] = [];
        let users = this.chatRooms[roomname].users;
        Object.keys(users).forEach((key) => {
            result.push(users[key]);
        });
        return result;
    }

    getUserByID(socketId: string): User {
        return this.onlineUsers[socketId];
    }

    userExist(socketId: string) {
        return this.onlineUsers[socketId] !== undefined;
    }

    // when a new user login, put him into the default room
    login(user: User) {
        this.onlineUsers[user.socketId] = user;
        this.chatRooms['public hall'].join(user);
        user.roomname = 'public hall';
    }

    logout(user: User) {
        delete this.onlineUsers[user.socketId];
        this.chatRooms[user.roomname].exit(user);
    }

    switchRoom(user: User, roomname: string): boolean {
        // check if the room name is correct
        if ((user.roomname == roomname) || !(roomname in this.chatRooms)) {
            return false;
        }
        this.chatRooms[user.roomname].exit(user);
        this.chatRooms[roomname].join(user);
        user.roomname = roomname;
        return true;
    }

    addRoom(user: User, roomname: string): boolean {
        if ((user.roomname == roomname) || (roomname in this.chatRooms)) {
            return false;
        }
        this.chatRooms[roomname] = new ChatRoom(roomname, user);
        return true;
    }
    getRooms() {
        return this.chatRooms;
    }
}
