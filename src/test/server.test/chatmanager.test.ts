import {ChatManager} from "../../src/server/chatmanager";
import {User, ChatRoom, Message} from "../../src/model";
import {createHash} from "crypto";


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
        expect(manager.userExist(user.socketId)).toBeTruthy();
        expect(manager.userExist('fake')).toBeFalsy();
    });

    test('test user logout', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);

        expect(manager.userExist(user.socketId)).toBeFalsy();
        manager.login(user);
        expect(manager.userExist(user.socketId)).toBeTruthy();
        expect(manager.userExist('fake')).toBeFalsy();

        manager.logout(user);
        expect(manager.userExist(user.socketId)).toBeFalsy();
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
        expect(manager.rooms['public hall'].users['jason']).toBe(user);
        expect(manager.rooms['room'].users['jason']).toBeUndefined();

        manager.switchRoom(user, 'room');

        // user's room name changed
        expect(user.roomname).toEqual('room');
        // new room contains user
        expect(manager.rooms['room'].users['jason']).toBe(user);
        // old room doesn't contain user
        expect(manager.rooms['public hall'].users['jason']).toBeUndefined();
    });

    test('test switch room', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);
        manager.login(user);
        manager.addRoom(user, 'room');

        expect(user.roomname).toEqual('public hall');
        expect(manager.rooms['public hall'].users['jason']).toBe(user);
        expect(manager.rooms['room'].users['jason']).toBeUndefined();

        expect(manager.switchRoom(user, 'room')).toBeTruthy();

        // user's room name changed
        expect(user.roomname).toEqual('room');
        // new room contains user
        expect(manager.rooms['room'].users['jason']).toBe(user);
        // old room doesn't contain user
        expect(manager.rooms['public hall'].users['jason']).toBeUndefined();
    });
});
