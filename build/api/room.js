"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIOServer_1 = require("../socket/SocketIOServer");
exports.createRoom = (req, res) => res.redirect(`/r/${SocketIOServer_1.generateRoomID()}`);
