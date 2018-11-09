import * as express from 'express';
import {Router, Application} from 'express';
import {Server, createServer} from "http";


export default class ChatServer {
    private readonly _app : Application;
    private readonly _server: Server;

    constructor(private port: number) {
        this._app = express();
        this._server = createServer(this.app);
    }

    get app(): Application {
        return this._app;
    }

    get server(): Server{
        return this._server;
    }

    start(callback ?: Function) {
        this._app.listen(this.port, callback);
    }

    setRouter(router: Router) {
        this._app.use(router);
    }

    setStaticPath(path: string) {
        this._app.use(express.static(path));
    }

    static init(port: number) : ChatServer{
        return new ChatServer(port);
    }
}
