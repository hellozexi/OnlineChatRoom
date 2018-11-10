import {Router, Request, Response} from 'express';
import * as express from 'express';
import path = require("path");

//import '../../www/client.css'
const router = Router();
router.use('/', express.static(path.resolve('/index.html')));
// router.get('/', function (req, res) {
//     res.sendFile("index.html");
// });

export default router;
