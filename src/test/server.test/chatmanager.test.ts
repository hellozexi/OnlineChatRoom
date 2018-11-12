import {ChatManager} from "../../src/server/chatmanager";
import {User} from "../../src/model";

describe('Test the ChatManager', () => {

    test('test user login', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);

        manager.login(user);
        let user_by_id = manager.getUserByID(socketId);
        expect(user_by_id.roomname).toBe('public hall');
    });

    test('tell if user exist', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);

        manager.login(user);
        expect(manager.hasUserId(user.socketId)).toBeTruthy();
        expect(manager.hasUserId('fake')).toBeFalsy();
    });

    test('test user logout', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);

        expect(manager.hasUserId(user.socketId)).toBeFalsy();
        manager.login(user);
        expect(manager.hasUserId(user.socketId)).toBeTruthy();
        expect(manager.hasUserId('fake')).toBeFalsy();

        manager.logout(user);
        expect(manager.hasUserId(user.socketId)).toBeFalsy();
    });

    test('test add room', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);

        manager.addRoom(user, 'room');
        let room = manager.rooms['room'];
        expect(room.name).toEqual('room');
        expect(room.admin).toBe(user);
    });

    test('test switch room', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);
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

    test('test switch room', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);
        manager.login(user);
        manager.addRoom(user, 'room');

        expect(user.roomname).toEqual('public hall');
        expect(manager.rooms['public hall'].users).toContain(user);
        expect(manager.rooms['room'].users).toHaveLength(0);

        expect(manager.switchRoom(user, 'room')).toBeTruthy();

        // user's room name changed
        expect(user.roomname).toEqual('room');
        // new room contains user
        expect(manager.rooms['room'].users).toContain(user);
        // old room doesn't contain user
        expect(manager.rooms['public hall'].users).toHaveLength(0);
    });
});
