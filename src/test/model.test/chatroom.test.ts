import {ChatRoom, User} from "../../src/model";


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
    let chatroom = new ChatRoom('public hall', user);
    expect(chatroom.users).toEqual({});
    expect(chatroom.admin).toBe(user);
    expect(chatroom.name).toEqual('public hall');
});
