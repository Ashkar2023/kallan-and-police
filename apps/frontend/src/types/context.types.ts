import { GameRoom } from "common";
import { UUID } from "crypto";
import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";


export interface ISocketContext {
    socket: Socket | null;
    connected: boolean;
    room: GameRoom | null;
    playerId: string | null;
    name: string | null;
    roomKey: string | null;
    host: UUID | null;
    setRoom: Dispatch<SetStateAction<GameRoom | null>>;
    setHost: (playerId: string) => void;
    setPlayerId: (playerId: string | null) => void;
    setName: (name: string) => void;
    setRoomKey: (roomKey: string | null) => void;
}
