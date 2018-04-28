"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SocketIOServer_1 = require("../socket/SocketIOServer");
const router = express_1.Router();
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/create', (req, res) => {
    console.log('Creating a new chat room');
    res.redirect(`/${SocketIOServer_1.generateRoomID()}`);
});
router.get('/:room', function (req, res) {
    res.render('room');
});
exports.default = router;
