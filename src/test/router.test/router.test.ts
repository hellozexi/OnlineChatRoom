import * as request from 'supertest';
import {ChatServer} from '../../src/server'

describe('Test the root path', () => {
    test('respond 200 for root', (done) => {
        let chat = new ChatServer(8080);
        request(chat.express_app).get('/').then((response: any) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test the static files', () => {
    test('respond 200 for root', (done) => {
        let chat = new ChatServer(8080);
        request(chat.express_app).get('/index.html').then((response: any) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    test('respond 200 for root', (done) => {
        let chat = new ChatServer(8080);
        request(chat.express_app).get('/client.css').then((response: any) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
