import {User} from "./user";

export class ChatRoom {
    private readonly _name: string;
    private readonly _admin: User;
    private _users: { [key: string]: User };

    constructor(name: string, admin: User) {
        this._name = name;
        this._admin = admin;
    }

    get name(): string {
        return this._name;
    }

    get admin(): User {
        return this._admin;
    }

    get users(): {[key: string]: User} {
        return this._users;
    }

    join(user: User) {
        this._users[user.name] = user;
    }

    exit(user: string) {
        delete this._users[user];
    }
}
