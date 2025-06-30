import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextProps {
    socket: Socket | null;
    connected: boolean
}

const SocketContext = createContext<SocketContextProps>({ socket: null, connected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL,
            {
                reconnectionAttempts: 4,
                reconnectionDelay: 3000,
                rememberUpgrade: true,
                reconnectionDelayMax: 5000,
                transports: ["websocket"]
            }
        );

        newSocket.on("connect", () => {
            setSocket(newSocket);
            setConnected(newSocket.connected);
        })

        newSocket.on("disconnect", () => {
            setSocket(null);
            setConnected(newSocket.connected);
        })

        newSocket.on("connect_error", () => {
            setConnected(newSocket.connected);
        })

        return () => {
            newSocket.removeAllListeners();
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};