import {ChatRoom} from "./chatroom";
import {User} from "./user";

export class PrivateChatRoom extends ChatRoom{
    private readonly _password: string;
    constructor(name: string, admin: User, password: string) {
        super(name, admin);
        this._password = password;
    }

    check_passwd(password: string): boolean {
        return this._password == password;
    }
}
