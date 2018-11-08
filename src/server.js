"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.set("port", process.env.PORT || 3000);
var http = require('http').Server(app);
app.get('/', function (req, res) {
    res.send('hello world');
});
var server = http.listen(3000, function () {
    console.log('listening on *:3000');
});
