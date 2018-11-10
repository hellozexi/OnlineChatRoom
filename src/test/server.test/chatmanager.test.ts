import {ChatManager} from "../../src/server/chatmanager";
import {User, ChatRoom, Message} from "../../src/model";


describe('Test the ChatManager', () => {
    test('test add user', () => {
        let manager = new ChatManager();
        let socketId = 'mock socket id';
        let user = new User('jason', socketId);
        manager.addNewUser(user);

        let user_by_id = manager.getUserByID(socketId);
        expect(user_by_id.roomname).toBe('public hall');

    });
});
