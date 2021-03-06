import React from 'react';
import { createContext } from 'react';
import { useSocket } from '../hooks/useSocket'

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    //socket server
    const { socket, online } = useSocket('http://localhost:8080');
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}