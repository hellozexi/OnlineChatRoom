import {User} from "./user";

export class ChatRoom {
    private readonly _name: string;
    private readonly _admin: User;
    private readonly _users: Map<string, User>;
    private readonly _ban_list: Set<string>;

    constructor(name: string, admin: User) {
        this._name = name;
        this._admin = admin;
        this._users = new Map<string, User>();
        this._ban_list = new Set<string>();
    }

    get name(): string {
        return this._name;
    }

    get admin(): User {
        return this._admin;
    }

    get users(): User[] {
        let result:User[] = [];
        for (let  user of this._users.values()) {
            result.push(user);
        }
        return result;
    }

    banUser(admin: User, banned: User): boolean {
        if (this.admin.socketId !== admin.socketId)
            return false;
        this._ban_list.add(banned.socketId);
        return true;
    }

    join(user: User): boolean {
        if (this._ban_list.has(user.socketId))
            return false;
        this._users.set(user.socketId, user);
        return true;
    }

    exit(user: User) {
        this._users.delete(user.socketId);
    }
}
