"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan = require("morgan");
const http_1 = require("http");
const index_1 = require("./router/index");
const SocketIOServer = require("./socket/SocketIOServer");
function startServer() {
    const PORT = process.env.PORT || 5000;
    const app = express();
    const server = http_1.createServer(app);
    console.log(`Starting server on port ${PORT}`);
    SocketIOServer.init(server);
    app.use(express.static('public'));
    app.use('/', index_1.default);
    app.set('view engine', 'pug');
    app.use(morgan('dev'));
    app.set('port', PORT);
    server.listen(PORT, () => console.log('Server running on port: ' + PORT));
}
startServer();
