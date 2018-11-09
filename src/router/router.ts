import {Router, Request, Response} from 'express';
import path = require("path");

//import '../../www/client.css'
const router = Router();
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,"..", "..", "www", "index.html" ));
})

export default router;