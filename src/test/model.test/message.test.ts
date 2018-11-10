import {Message} from "../../src/model";


describe('Test the Message', () => {
    test('test create', () => {
        let msg = new Message('jason', 'greetings');
        expect(msg.username).toEqual('jason');
        expect(msg.message).toEqual('greetings');
    });
});
