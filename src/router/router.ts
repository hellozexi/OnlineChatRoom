import {Router, Request, Response} from 'express';
import path = require("path");

const router = Router();
router.get('/', function (req, res) {
    res.sendFile("index.html");
});

export default router;