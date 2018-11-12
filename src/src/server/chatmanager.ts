import {ChatRoom, User} from "../model";
import {UserManager} from "./usermanager";

export class ChatManager {
    private readonly chatRooms: Map<string, ChatRoom>;
    private readonly onlineUsers: UserManager;


    constructor() {
        this.chatRooms = new Map<string, ChatRoom>();
        this.onlineUsers = new UserManager();

        this.chatRooms.set('public hall', new ChatRoom('public hall', null));
    }

    get rooms(): {[key: string]: ChatRoom; } {
        let rooms: {[key: string]: ChatRoom; } = {};
        for (let [key, value] of this.chatRooms.entries()) {
            rooms[key] = value;
        }
        return rooms;
    }

    usersInRoom(roomname: string): User[] {
        return this.chatRooms.get(roomname).users;
    }

    getUserByID(socketId: string): User {
        return this.onlineUsers.getById(socketId);
    }

    getUserByName(name: string): User {
        return this.onlineUsers.getByName(name);
    }

    hasUserId(socketId: string): boolean {
        return this.onlineUsers.hasId(socketId);
    }

    hasUserName(username: string): boolean {
        return this.onlineUsers.hasName(username);
    }

    // when a new user login, put him into the default room
    login(user: User) {
        this.onlineUsers.set(user);
        this.chatRooms.get('public hall').join(user);
        user.roomname = 'public hall';
    }

    logout(user: User) {
        this.onlineUsers.delete(user);
        this.chatRooms.get(user.roomname).exit(user);
    }

    switchRoom(user: User, roomname: string): boolean {
        // check if the room name is correct
        if ((user.roomname == roomname) || !this.chatRooms.has(roomname)) {
            return false;
        }
        this.chatRooms.get(user.roomname).exit(user);
        this.chatRooms.get(roomname).join(user);
        user.roomname = roomname;
        return true;
    }

    addRoom(user: User, roomname: string): boolean {
        if (this.chatRooms.has(roomname)) {
            return false;
        }
        this.chatRooms.set(roomname, new ChatRoom(roomname, user));
        return true;
    }
}
