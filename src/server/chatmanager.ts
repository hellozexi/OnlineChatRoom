import {ChatRoom, User} from "../model";
import {Socket} from "socket.io";

export class ChatManager {
    private readonly chatRooms: {[key: string]: ChatRoom};
    private readonly onlineUsers: {[key: string]: User};

    constructor() {
        this.chatRooms = {};
        this.onlineUsers = {};

        this.chatRooms['public hall'] = new ChatRoom('public hall', null)
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

    // when a new user is added, put him into the default room
    addNewUser(user: User) {
        this.onlineUsers[user.socketId] = user;
        this.chatRooms['public hall'].join(user);
        user.roomname = 'public hall';
    }

    switchRoom(user: User, roomname: string): boolean {
        // check if the room name is correct
        if ((user.roomname == roomname) || !(roomname in this.chatRooms)) {
            return false;
        }
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
}
