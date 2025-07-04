import { ISocketContext } from '@/types/context.types';
import { createContext } from 'react';

export const SocketContext = createContext<ISocketContext>({
    socket: null,
    connected: false,
});