import {ChatRoom, User} from "../../src/model";


describe('Test the ChatRoom', () => {
    let user: User;
    let chatroom: ChatRoom;

    beforeEach(() => {
        user = new User('jason', 'mock socket id');
        chatroom = new ChatRoom('public hall', null);
    });

    test('test chatroom without admin', () => {
        chatroom = new ChatRoom('public hall', null);
        expect(chatroom.users).toEqual([]);
        expect(chatroom.users).toHaveLength(0);
        expect(chatroom.admin).toBeNull();
        expect(chatroom.name).toEqual('public hall');
    });

    test('test chatroom with admin', () => {
        chatroom = new ChatRoom('hall', user);
        expect(chatroom.users).toEqual([]);
        expect(chatroom.users).toHaveLength(0);
        expect(chatroom.admin).toBe(user);
        expect(chatroom.name).toEqual('hall');
    });

    test('test join chat room', () => {
        chatroom = new ChatRoom('public hall', null);

        chatroom.join(user);
        expect(chatroom.users).toContain(user);
    });

    test('test ban user', () => {
        chatroom = new ChatRoom('public hall', user);
        let jack = new User('jack', 'socket id');

        expect(chatroom.join(jack)).toBeTruthy();
        expect(chatroom.users).toContain(jack);

        chatroom.exit(jack);
        expect(chatroom.banUser(user, jack)).toBeTruthy();
        expect(chatroom.join(jack)).toBeFalsy();
    });

    test('test ban user of public hall', () => {
        chatroom = new ChatRoom('public hall', undefined);
        let jack = new User('jack', 'socket id');

        expect(chatroom.join(jack)).toBeTruthy();
        expect(chatroom.users).toContain(jack);

        chatroom.exit(jack);
        expect(chatroom.banUser(user, jack)).toBeFalsy();
        expect(chatroom.join(jack)).toBeTruthy();
    });

    test('test exit chat room', () => {
        chatroom.join(user);
        expect(chatroom.users).toContain(user);

        chatroom.exit(user);
        expect(chatroom.users).toEqual([]);
        expect(chatroom.users).toHaveLength(0);
    });

    test('test exit chat room not exist', () => {
        expect(chatroom.users).toEqual([]);
        expect(chatroom.users).toHaveLength(0);
        chatroom.exit(new User('not exist', 'fake'));
        expect(chatroom.users).toEqual([]);
        expect(chatroom.users).toHaveLength(0);
    });
});
