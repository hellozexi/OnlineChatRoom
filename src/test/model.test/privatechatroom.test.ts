import {PrivateChatRoom, User} from "../../src/model";


describe('Test the ChatRoom', () => {
    let user: User;
    let chatroom: PrivateChatRoom;

    beforeEach(() => {
        user = new User('jason', 'mock socket id');
        chatroom = new PrivateChatRoom('public hall', user, 'passwd');
    });

    test('test chatroom with admin', () => {
        expect(chatroom.users).toEqual([]);
        expect(chatroom.users).toHaveLength(0);
        expect(chatroom.admin).toBe(user);
        expect(chatroom.name).toEqual('public hall');
    });

    test('test join chat room', () => {
        chatroom.join(user);
        expect(chatroom.users).toContain(user);
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

    test('test password', () => {
        expect(chatroom.check_passwd('passwd')).toBeTruthy();
    });

    test('test wrong password', () => {
        expect(chatroom.check_passwd('wrong')).toBeFalsy();
    });
});