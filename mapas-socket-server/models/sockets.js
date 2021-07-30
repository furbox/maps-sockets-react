const Marcadores = require("./marcadores");

class Sockets {
    constructor(io) {
        this.io = io;
        this.marcadores = new Marcadores();
        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log('[SOCKET]: Client Connected');
            console.log('[SOCKET]: ', socket.id);

            socket.emit('[SERVER]:msg-bienvenida', {
                msg: 'Bienvenido al Server',
                fecha: new Date()
            });

            socket.on('[SOCKET-CLIENT]:msg-emit', (data) => {
                this.io.emit('[SOCKET-SERVER]:msg-emit', data);
            });

            socket.emit('[SOCKET-SERVER]:marcadoresActivos', this.marcadores.activos);

            socket.on('[SOCKET-CLIENT]:marcadorNuevo', (marcador) => {
                this.marcadores.agregarMarcador(marcador);
                socket.broadcast.emit('[SOCKET-SERVER]:marcadorNuevo', marcador);
            });

            socket.on('[SOCKET-CLIENT]:marcadorActualizado', (marcador) => {
                this.marcadores.actualizarMarcador(marcador);
                socket.broadcast.emit('[SOCKET-SERVER]:marcadorActualizado', marcador);
            });
        });
    }
}

module.exports = Sockets;