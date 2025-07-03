import { UUID } from "node:crypto";
import { socketEvents } from "../constants/events";
import { GameRoom } from "./game.types";
import { Player } from "./player.types";

export type ISocketData<T extends Record<string, any> = {}> = { roomKey: string } & T;

export type UpdatePlayerStatusData = { status: Player["status"]; roomKey: string; playerId: UUID };

export interface ServerToClientEvents {
    ERROR: string;
    ROOM_INFO: {
        roomKey: string; room: GameRoom; playerId: UUID
    }
    PLAYER_JOINED: {
        roomKey: string; room: GameRoom; playerId: UUID;
    }
    UPDATE_PLAYER_STATUS: UpdatePlayerStatusData;
}

export interface ClientToServerEvents {
    CREATE_ROOM: { player_name: string };
    JOIN_ROOM: { player_name: string; roomKey: string; password: string };
    UPDATE_PLAYER_STATUS: UpdatePlayerStatusData;
}