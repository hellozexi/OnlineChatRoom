export class User {
    private _roomname: string;
    public readonly name: string;
    public readonly socketId: string;

    constructor(name: string, socketId: string) {
        this._roomname = null;
        this.name = name;
        this.socketId = socketId;
    }

    get roomname(): string {
        return this._roomname;
    }

    set roomname(room: string) {
        this._roomname = room;
    }

}
