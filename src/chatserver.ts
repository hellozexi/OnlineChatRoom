import * as express from 'express';
import {Router, Application} from 'express';
import {Server, createServer} from "http";
import {SocketManager} from "./server/socketmanager";


export default class ChatServer {
    private readonly _app : Application;
    private readonly _server: Server;
    private readonly _socketsManager: SocketManager;

    constructor(private port: number) {
        this._app = express();
        this._server = createServer(this.app);
        this._socketsManager = new SocketManager(this.server);
    }

    get app(): Application {
        return this._app;
    }

    get server(): Server{
        return this._server;
    }

    get socket(): SocketManager {
        return this._socketsManager;
    }

    start() {
        // this._app.listen(this.port, callback);
        this.server.listen(this.port);
    }

    setRouter(router: Router) {
        this._app.use(router);
    }

    setStaticPath(path: string) {
        this._app.use(express.static(path));
    }

}
