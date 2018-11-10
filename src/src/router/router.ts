import {Router, Request, Response} from 'express';
import path = require("path");

//import '../../www/client.css'
const router = Router();
router.get('/', function (req, res) {
    res.sendFile("index.html");
});

export default router;
