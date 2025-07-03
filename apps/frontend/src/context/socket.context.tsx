import { ISocketContext } from '@/types/context.types';
import { createContext } from 'react';

export const SocketContext = createContext<ISocketContext>({
    socket: null,
    connected: false,
    room: null,
    roomKey: null,
    name: null,
    playerId: null,
    host: null,
    setHost: () => { },
    setRoomKey: () => { },
    setRoom: () => { },
    setPlayerId: () => { },
    setName: () => { },
});