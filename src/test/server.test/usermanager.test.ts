import {UserManager} from "../../src/server/UserManager";
import {User} from "../../src/model";

describe('Test the UserManager', () => {
    let manager: UserManager;

    beforeEach(() => {
        manager = new UserManager();
    });

    test('test set user', () => {
        expect(manager.size).toEqual(0);
        expect(manager.set(new User('jason', 'mock socket id'))).toBeTruthy();
        expect(manager.size).toEqual(1);
        expect(manager.set(new User('ben', 'another mock id'))).toBeTruthy();
        expect(manager.size).toEqual(2);
        expect(manager.set(new User('jack', 'just a mock id'))).toBeTruthy();
        expect(manager.size).toEqual(3);
    });

    test('test set duplicate user name', () => {
        expect(manager.size).toEqual(0);
        expect(manager.set(new User('jason', 'mock socket id'))).toBeTruthy();
        expect(manager.size).toEqual(1);
        expect(manager.set(new User('jason', 'another mock id'))).toBeFalsy();
        expect(manager.size).toEqual(1);
        expect(manager.set(new User('jack', 'just a mock id'))).toBeTruthy();
        expect(manager.size).toEqual(2);
    });

    test('test set duplicate socket id', () => {
        expect(manager.size).toEqual(0);
        expect(manager.set(new User('jason', 'mock socket id'))).toBeTruthy();
        expect(manager.size).toEqual(1);
        expect(manager.set(new User('ben', 'mock socket id'))).toBeFalsy();
        expect(manager.size).toEqual(1);
        expect(manager.set(new User('jack', 'just a mock id'))).toBeTruthy();
        expect(manager.size).toEqual(2);
    });

    test('test has name and has id', () => {
        let username = 'jason';
        let socketId = 'mock socket id';
        expect(manager.size).toEqual(0);
        expect(manager.hasId(socketId)).toBeFalsy();
        expect(manager.hasName(username)).toBeFalsy();
        expect(manager.set(new User(username, socketId))).toBeTruthy();
        expect(manager.size).toEqual(1);
        expect(manager.hasId(socketId)).toBeTruthy();
        expect(manager.hasName(username)).toBeTruthy();
    });

    test('test get user by id', () => {
        let socketId = 'mock socket id';
        let username = 'jason';
        let user = new User(username, socketId);

        expect(manager.size).toEqual(0);
        expect(manager.set(user)).toBeTruthy();
        expect(manager.size).toEqual(1);
        expect(manager.getById(socketId)).toBe(user);
        expect(manager.getById('another id')).toBeUndefined();
    });

    test('test get user by name', () => {
        let socketId = 'mock socket id';
        let username = 'jason';
        let user = new User(username, socketId);

        expect(manager.size).toEqual(0);
        expect(manager.set(user)).toBeTruthy();
        expect(manager.size).toEqual(1);
        expect(manager.getByName(username)).toBe(user);
        expect(manager.getByName('another name')).toBeUndefined();
    });

    test('test delete user', () => {
        let socketId = 'mock socket id';
        let username = 'jason';
        let user = new User(username, socketId);

        // user is in there
        expect(manager.size).toEqual(0);
        expect(manager.set(user)).toBeTruthy();
        expect(manager.size).toEqual(1);
        expect(manager.hasName(username)).toBeTruthy();
        expect(manager.hasId(socketId)).toBeTruthy();
        // could not delete user if given the wrong name
        expect(manager.delete(new User('wrong name', socketId))).toBeFalsy();
        expect(manager.size).toEqual(1);
        expect(manager.hasName(username)).toBeTruthy();
        expect(manager.hasId(socketId)).toBeTruthy();
        // could not delete user if given the wrong id
        expect(manager.delete(new User(username, 'wrong id'))).toBeFalsy();
        expect(manager.size).toEqual(1);
        expect(manager.hasName(username)).toBeTruthy();
        expect(manager.hasId(socketId)).toBeTruthy();
        // successfully delete user with the right name and id
        expect(manager.delete(user)).toBeTruthy();
        expect(manager.size).toEqual(0);
        expect(manager.hasName(username)).toBeFalsy();
        expect(manager.hasId(socketId)).toBeFalsy();
    });
});
