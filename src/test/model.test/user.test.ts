import {User} from "../../src/model";


describe('Test the User', () => {
    let user: User;

    beforeEach(() => {
        user = new User('jason', 'mock socket id');
    })

    test('test create user', () => {
        expect(user.name).toEqual('jason');
        expect(user.socketId).toEqual('mock socket id');
        expect(user.roomname).toBeNull();
    });

    test('test change room', () => {
        user.roomname = 'hall';
        expect(user.roomname).toEqual('hall');
        user.roomname = 'another hall';
        expect(user.roomname).toEqual('another hall');
    });
});

