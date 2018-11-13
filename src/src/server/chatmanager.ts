import {ChatRoom, PrivateChatRoom, User} from "../model";
import {UserManager} from "./usermanager";

export class ChatManager {
    private readonly chatRooms: Map<string, ChatRoom>;
    private readonly privateChatRooms: Map<string, PrivateChatRoom>;
    private readonly onlineUsers: UserManager;


    constructor() {
        // chat rooms or private chat rooms should not have a same name
        this.chatRooms = new Map<string, ChatRoom>();
        this.privateChatRooms = new Map<string, PrivateChatRoom>();
        this.onlineUsers = new UserManager();

        this.chatRooms.set('public hall', new ChatRoom('public hall'));
    }

    get rooms(): {[key: string]: ChatRoom; } {
        let rooms: {[key: string]: ChatRoom; } = {};
        for (let [key, value] of this.chatRooms.entries()) {
            rooms[key] = value;
        }
        return rooms;
    }

    get privateRooms():  {[key: string]: PrivateChatRoom; } {
        let rooms: {[key: string]: PrivateChatRoom; } = {};
        for (let [key, value] of this.privateChatRooms.entries()) {
            rooms[key] = value;
        }
        return rooms;
    }

    usersInRoom(roomname: string): User[] {
        if (this.chatRooms.has(roomname))
            return this.chatRooms.get(roomname).users;
        if (this.privateChatRooms.has(roomname))
            return this.privateChatRooms.get(roomname).users;
        // if roomname not exist, return undefined;
        return undefined;
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
    login(user: User): boolean {
        if (user === undefined)
            return false;
        // duplicate user name or socket id
        if (!this.onlineUsers.set(user))
            return false;
        this.chatRooms.get('public hall').join(user);
        user.roomname = 'public hall';
        return true
    }

    logout(user: User) {
        console.log('user from logout');
        console.log(user);
        this.onlineUsers.delete(user);
        this.chatRooms.get(user.roomname).exit(user);
    }

    addRoom(user: User, roomname: string): boolean {
        if (user === undefined)
            return false;
        // check if roomname has been used for chat room or private chat room
        if (this.chatRooms.has(roomname) || this.privateChatRooms.has(roomname)) {
            return false;
        }
        this.chatRooms.set(roomname, new ChatRoom(roomname, user));
        return true;
    }

    addPrivateRoom(user: User, roomname: string, password: string): boolean {
        if (user === undefined)
            return false;
        // check if roomname has been used for chat room or private chat room
        if (this.chatRooms.has(roomname) || this.privateChatRooms.has(roomname)) {
            return false;
        }
        this.privateChatRooms.set(roomname, new PrivateChatRoom(roomname, user, password));
        return true;
    }

    switchRoom(user: User, roomname: string): boolean {
        if (user === undefined)
            return false;
        // check if the room name is correct
        if ((user.roomname == roomname) || !this.chatRooms.has(roomname)) {
            return false;
        }
        // if this user is banned
        if (!this.chatRooms.get(roomname).join(user))
            return false;
        // exit the original room
        if (this.chatRooms.has(user.roomname))
            this.chatRooms.get(user.roomname).exit(user);
        if (this.privateChatRooms.has(user.roomname))
            this.privateChatRooms.get(user.roomname).exit(user);
        user.roomname = roomname;
        return true;
    }

    switchPrivateRoom(user: User, roomname: string, password: string): boolean {
        // check if the room name is correct
        if ((user.roomname == roomname) || !this.privateChatRooms.has(roomname)) {
            return false;
        }
        // check password
        if (!this.privateChatRooms.get(roomname).check_passwd(password))
            return false;
        // if this user is banned
        if (!this.privateChatRooms.get(roomname).join(user))
            return false;
        // exit the original room
        if (this.chatRooms.has(user.roomname))
            this.chatRooms.get(user.roomname).exit(user);
        if (this.privateChatRooms.has(user.roomname))
            this.privateChatRooms.get(user.roomname).exit(user);
        user.roomname = roomname;
        return true
    }

    banUser(admin: User, banned: User, roomname: string): boolean {
        if (this.chatRooms.has(roomname))
            // return if it could be banned
            return this.chatRooms.get(roomname).banUser(admin, banned);
        if (this.privateChatRooms.has(roomname))
            // return if it could be banned
            return this.privateChatRooms.get(roomname).banUser(admin, banned);
        // room does not exist
        return false;
    }

    kickUserOut(admin: User, out: User, roomname: string): boolean {
        if (this.chatRooms.has(roomname)) {
            // admin is not the admin of the chat room
            let chatroom = this.chatRooms.get(roomname);
            if (chatroom.admin === undefined || chatroom.admin.socketId !== admin.socketId)
                return false;
            return this.switchRoom(out, 'public hall');
        }
        if (this.privateChatRooms.has(roomname)) {
            // admin is not the admin of the chat room
            // privateChatRoom must have an admin
            if (this.privateChatRooms.get(roomname).admin.socketId !== admin.socketId)
                return false;
            return this.switchRoom(out, 'public hall');
        }
        // room does not exist
        return false;
    }
}
