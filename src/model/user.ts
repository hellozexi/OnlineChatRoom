export class User {
    private readonly _name: string;
    private _roomname: string;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    get roomname(): string {
        return this._roomname;
    }

    set roomname(room: string) {
        this._roomname = room;
    }

}
