import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';

import { useMapbox } from '../hooks/useMapbox';
const puntoInicial = {
    lng: -89.6281,
    lat: 21.0161,
    zoom: 14
}

export const MapaPage = () => {

    const { setRef, coords, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox(puntoInicial);
    const { socket } = useContext(SocketContext);

    //escuchar los marcadores existentes
    useEffect(() => {
        socket.on('[SOCKET-SERVER]:marcadoresActivos', (marcadores) => {
            for (const key of Object.keys(marcadores)) {
                agregarMarcador(marcadores[key], key);
            }
        });
    }, [socket, agregarMarcador])

    useEffect(() => {
        nuevoMarcador$.subscribe(marcador => {
            //nuevo marcador emitir
            socket.emit('[SOCKET-CLIENT]:marcadorNuevo', marcador);
        });
    }, [nuevoMarcador$, socket]);

    useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {
            //nuevo marcador emitir
            socket.emit('[SOCKET-CLIENT]:marcadorActualizado', marcador);
        });
    }, [movimientoMarcador$, socket]);

    //mover marcador mediante sockets
    useEffect(() => {
        socket.on('[SOCKET-SERVER]:marcadorActualizado', (marcador) => {
            actualizarPosicion(marcador);
        });
    }, [actualizarPosicion, socket]);

    useEffect(() => {
        socket.on('[SOCKET-SERVER]:marcadorNuevo', (marcador) => {
            agregarMarcador(marcador, marcador.id);
        });
    }, [socket, agregarMarcador]);

    return (
        <>
            <div className="info">
                Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
            </div>
            <div ref={setRef} className="mapContainer" />
        </>
    )
}
