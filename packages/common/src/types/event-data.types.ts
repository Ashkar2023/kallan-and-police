import { UUID } from "node:crypto";
import { socketEvents } from "../constants/events";
import { GameRoom } from "./game.types";
import { Player } from "./player.types";

export type ISocketData<T extends Record<string, any> = {}> = { roomId: string } & T;

export type UpdatePlayerStatusData = { status: Player["status"]; roomId: string; playerId: UUID };

export interface ServerToClientEvents {
    ERROR: string,
    ROOM_INFO: {
        roomId: string; room: GameRoom; playerId: UUID
    },
    PLAYER_JOINED: {
        roomId: string; room: GameRoom; playerId: UUID;
    },
    PLAYER_LEFT: GameRoom,
    UPDATE_PLAYER_STATUS: UpdatePlayerStatusData,
}

export interface ClientToServerEvents {
    CREATE_ROOM: { player_name: string },
    JOIN_ROOM: { player_name: string; roomId: string; password: string },
    UPDATE_PLAYER_STATUS: UpdatePlayerStatusData,
    EXIT_ROOM: UpdatePlayerStatusData,
}