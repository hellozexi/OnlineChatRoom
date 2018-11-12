import {User} from "./user";

export class ChatRoom {
    private readonly _name: string;
    private readonly _admin: User;
    private readonly _users: Map<string, User>;

    constructor(name: string, admin: User) {
        this._name = name;
        this._admin = admin;
        this._users = new Map<string, User>();
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

    join(user: User) {
        this._users.set(user.name, user);
    }

    exit(user: User) {
        this._users.delete(user.name);
    }
}
