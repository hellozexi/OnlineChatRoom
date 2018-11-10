import {ChatRoom} from "../../src/model";


test('test chatroom without admin', () => {
    let chatroom = new ChatRoom('public hall', null);
    expect(chatroom.users).toEqual({});
    expect(chatroom.admin).toBeNull();
    expect(chatroom.name).toEqual('public hall');
});
