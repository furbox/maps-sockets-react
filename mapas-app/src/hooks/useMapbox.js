import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import mapboxgl from 'mapbox-gl';
import { Subject } from 'rxjs';
mapboxgl.accessToken = 'Token Mapbox';

export const useMapbox = (puntoInicial) => {
    const mapDiv = useRef();
    const setRef = useCallback((node) => {
        mapDiv.current = node;
    }, []);

    //referencia a los marcadores
    const marcadores = useRef({});

    //observables de Rxjs
    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());

    //mapa y coords
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);

    //agregar marcadores
    const agregarMarcador = useCallback((ev, id) => {
        const { lng, lat } = ev.lngLat || ev;
        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4();
        marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);
        marcadores.current[marker.id] = marker;

        if (!id) {
            nuevoMarcador.current.next({
                id: marker.id,
                lng, lat
            });
        }

        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();
            movimientoMarcador.current.next({ id, lng, lat });
        });
    }, []);

    //funcion para actualizar la ubicacion del marcador
    const actualizarPosicion = useCallback(({ id, lng, lat }) => {
        marcadores.current[id].setLngLat([lng, lat]);
    }, []);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [puntoInicial.lng, puntoInicial.lat],
            zoom: puntoInicial.zoom
        });
        mapa.current = map;
    }, [puntoInicial]);

    useEffect(() => {
        mapa.current?.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            });
        });
    }, []);

    //marcadores
    useEffect(() => {
        mapa.current?.on('click', (ev) => {
            agregarMarcador(ev);
        });
    }, [agregarMarcador]);

    return {
        actualizarPosicion,
        agregarMarcador,
        coords,
        marcadores,
        movimientoMarcador$: movimientoMarcador.current,
        nuevoMarcador$: nuevoMarcador.current,
        setRef
    }
}
