import { GameRoom, RoomStatus } from "common";
import { UUID } from "crypto";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "../socket.context";


export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [name, setName] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [host, setHost] = useState<string | null>(null);
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const [room, setRoom] = useState<GameRoom | null>({
        password: "",
        players: {},
        rounds: [],
        status: RoomStatus.LOBBY,
        host: null as unknown as UUID
    });

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL,
            {
                reconnectionAttempts: 4,
                reconnectionDelay: 3000,
                rememberUpgrade: true,
                reconnectionDelayMax: 5000,
                transports: ["websocket", "polling"]
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
        <SocketContext.Provider value={{ socket, connected, room, setRoom, playerId, setPlayerId, name, setName, host: host as null, setHost, roomKey, setRoomKey }}>
            {children}
        </SocketContext.Provider>
    );
};