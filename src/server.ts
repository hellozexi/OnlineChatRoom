import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path"
const app = express();
app.set("port", process.env.PORT || 3000);

var http = require('http').Server(app);

app.get('/', (req: any, res: any) => {
    res.sendFile(path.resolve('./client/client.html'))
});
const server = http.listen(3000, function(){
    console.log('listening on *:3000');
});