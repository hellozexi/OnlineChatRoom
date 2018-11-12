import {User} from "../model";

export class UserManager {
    private _usersById: Map<string, User>;
    private _usersByName: Map<string, User>;

    constructor() {
        this._usersById = new Map<string, User>();
        this._usersByName = new Map<string, User>();
    }

    get size(): number {
        return this._usersById.size;
    }

    set(user: User): boolean {
        if (this._usersById.has(user.socketId) || this._usersByName.has(user.name))
            return false;
        this._usersById.set(user.socketId, user);
        this._usersByName.set(user.name, user);
        return true;
    }

    hasId(socketId: string): boolean {
        return this._usersById.has(socketId);
    }

    hasName(name: string): boolean {
        return this._usersByName.has(name);
    }

    getById(socketId: string): User {
        return this._usersById.get(socketId);
    }

    getByName(name: string): User {
        return this._usersByName.get(name);
    }

    delete(user: User) {
        if (this._usersById.has(user.socketId) && this._usersByName.has(user.name))
            return this._usersById.delete(user.socketId) && this._usersByName.delete(user.name);
        return false;
    }
}
