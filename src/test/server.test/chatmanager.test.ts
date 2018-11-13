import {ChatManager} from "../../src/server/chatmanager";
import {User} from "../../src/model";

describe('Test the ChatManager', () => {
    let manager :ChatManager;
    let socketId = 'mock socket id';
    let user: User;

    beforeEach(() => {
        manager = new ChatManager();
        user = new User('jason', socketId);
    });

    test('test user login', () => {
        manager.login(user);
        let user_by_id = manager.getUserByID(socketId);
        expect(user_by_id.roomname).toBe('public hall');
    });

    test('tell if user exist', () => {
        expect(manager.hasUserId(user.socketId)).toBeFalsy();
        expect(manager.hasUserName(user.name)).toBeFalsy();
        manager.login(user);
        expect(manager.hasUserId(user.socketId)).toBeTruthy();
        expect(manager.hasUserName(user.name)).toBeTruthy();
        expect(manager.hasUserId('fake')).toBeFalsy();
        expect(manager.hasUserName('fake name')).toBeFalsy();
    });

    test('test user logout', () => {
        expect(manager.hasUserId(user.socketId)).toBeFalsy();
        manager.login(user);
        expect(manager.hasUserId(user.socketId)).toBeTruthy();
        expect(manager.hasUserId('fake')).toBeFalsy();

        manager.logout(user);
        expect(manager.hasUserId(user.socketId)).toBeFalsy();
        expect(manager.hasUserName(user.name)).toBeFalsy();
    });

    test('test create room', () => {
        manager.addRoom(user, 'room');
        let room = manager.rooms['room'];
        expect(room.name).toEqual('room');
        expect(room.admin).toBe(user);
    });

    test('test switch room', () => {
        manager.login(user);
        manager.addRoom(user, 'room');

        expect(user.roomname).toEqual('public hall');
        expect(manager.rooms['public hall'].users).toContain(user);
        expect(manager.rooms['room'].users).toHaveLength(0);

        manager.switchRoom(user, 'room');

        // user's room name changed
        expect(user.roomname).toEqual('room');
        // new room contains user
        expect(manager.rooms['room'].users).toContain(user);
        // old room doesn't contain user
        expect(manager.rooms['public hall'].users).toHaveLength(0);
    });

    test('test display users', () => {
        let jessy = new User('jessy', '1231224');
        let ben = new User('ben', '13432532');
        let fray = new User('fray', '2149730742');

        expect(manager.usersInRoom('public hall')).toHaveLength(0);
        expect(manager.login(user)).toBeTruthy();
        expect(manager.usersInRoom('public hall')).toContain(user);

        expect(manager.usersInRoom('public hall')).toHaveLength(1);
        expect(manager.login(jessy)).toBeTruthy();
        expect(manager.usersInRoom('public hall')).toContain(user);
        expect(manager.usersInRoom('public hall')).toContain(jessy);

        expect(manager.usersInRoom('public hall')).toHaveLength(2);
        expect(manager.login(ben)).toBeTruthy();
        expect(manager.usersInRoom('public hall')).toContain(user);
        expect(manager.usersInRoom('public hall')).toContain(jessy);
        expect(manager.usersInRoom('public hall')).toContain(ben);

        expect(manager.usersInRoom('public hall')).toHaveLength(3);
        expect(manager.login(fray)).toBeTruthy();
        expect(manager.usersInRoom('public hall')).toContain(user);
        expect(manager.usersInRoom('public hall')).toContain(jessy);
        expect(manager.usersInRoom('public hall')).toContain(ben);
        expect(manager.usersInRoom('public hall')).toContain(fray);

        expect(manager.usersInRoom('public hall')).toHaveLength(4);
        manager.logout(fray);
        expect(manager.usersInRoom('public hall')).toContain(user);
        expect(manager.usersInRoom('public hall')).toContain(jessy);
        expect(manager.usersInRoom('public hall')).toContain(ben);
        expect(manager.usersInRoom('public hall')).toHaveLength(3);
    });

    test('test ban user', () => {
        let fray = new User('fray', '2149730742');
        expect(manager.login(user)).toBeTruthy();
        expect(manager.login(fray)).toBeTruthy();
        expect(manager.addRoom(user, 'room')).toBeTruthy();
        // before ban, fray can get in room
        expect(manager.switchRoom(fray, 'room')).toBeTruthy();
        expect(manager.switchRoom(fray, 'public hall')).toBeTruthy();
        // ban fray
        expect(manager.banUser(user, fray, 'room')).toBeTruthy();
        // fray could not enter room
        expect(manager.switchRoom(fray, 'room')).toBeFalsy();
        expect(manager.usersInRoom('public hall')).toContain(fray);
        expect(manager.usersInRoom('room')).toEqual([]);
        expect(manager.usersInRoom('room')).toHaveLength(0);
    });
});
