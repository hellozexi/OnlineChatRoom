import {ChatRoom, User} from "../../src/model";


describe('Test the ChatRoom', () => {
    test('test chatroom without admin', () => {
        let chatroom = new ChatRoom('public hall', null);
        expect(chatroom.users).toEqual({});
        expect(chatroom.admin).toBeNull();
        expect(chatroom.name).toEqual('public hall');
    });

    test('test chatroom with admin', () => {
        let user = new User('jason', 'mock socket id');
        let chatroom = new ChatRoom('public hall', user);
        expect(chatroom.users).toEqual({});
        expect(chatroom.admin).toBe(user);
        expect(chatroom.name).toEqual('public hall');
    });

    test('test join chat room', () => {
        let user = new User('jason', 'mock socket id');
        let chatroom = new ChatRoom('public hall', null);

        chatroom.join(user);
        expect(chatroom.users[user.name]).toBe(user);
    });

    test('test exit chat room', () => {
        let user = new User('jason', 'mock socket id');
        let chatroom = new ChatRoom('public hall', null);

        chatroom.join(user);
        expect(chatroom.users[user.name]).toBe(user);

        chatroom.exit(user);
        expect(chatroom.users).toEqual({});
    });

    test('test exit chat room not exist', () => {
        let chatroom = new ChatRoom('public hall', null);
        expect(chatroom.users).toEqual({});
        chatroom.exit(new User('not exist', 'fake'));
        expect(chatroom.users).toEqual({});
    });
});
