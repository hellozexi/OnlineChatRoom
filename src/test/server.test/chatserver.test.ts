import * as io from 'socket.io-client'
import {ChatServer} from "../../src/server";
import {AddressInfo} from "net";
import Socket = SocketIOClient.Socket;

describe('test chatserver', () => {
    let chatserver: ChatServer;
    let socket: Socket;
    let httpServerAddr: string | AddressInfo;

    beforeAll((done) => {
        chatserver = new ChatServer(8080);
        httpServerAddr = chatserver.test_start();
        done();
    });

    afterAll((done) => {
        chatserver.close();
        done();
    });

    beforeEach((done) => {
        if (typeof httpServerAddr !== "string") {
            socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`,{
                reconnectionDelay: 0,
                transports: ['websocket']
            });
        }
        socket.on('connect', () => {
            done();
        });
    });

    afterEach((done) => {
        // Cleanup
        if (socket.connected) {
            socket.disconnect();
        }
        done();
    });

    test('should communicate', (done: Function) => {
        socket.emit('addUser', 'jason');
        socket.once('currentUsers', (message: any) => {
            expect(message).toHaveLength(1);
            done();
        })
    });
});