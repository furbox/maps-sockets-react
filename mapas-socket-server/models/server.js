const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');
const Sockets = require('./sockets');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.port || 8080;
        //http server
        this.server = http.createServer(this.app);
        //sockets
        this.io = socketio(this.server, {/* configuraciones */ });
    }

    middlewares() {
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        this.app.use(cors());
    }

    sockets() {
        new Sockets(this.io);
    }

    execute() {
        this.middlewares();
        this.sockets();

        this.server.listen(this.port, () => {
            console.log('[SERVER]: port:' + this.port);
        });
    }
}

module.exports = Server;