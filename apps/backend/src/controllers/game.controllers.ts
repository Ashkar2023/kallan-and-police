import { RoomStatus, socketEvents } from "@/constants/events.js";
import { ROOMS_MAP, ROOMS } from "@/data/data.js";
import { generateRoomId } from "@/utils/gen.js";
import logger from "@/utils/logger.js";
import { Player } from "common";
import { randomUUID } from "node:crypto";
import { Server, Socket } from "socket.io";

// create room
export const createRoom = (socket: Socket, io: Server) => {
    return async ({ player_name }: { player_name: string }) => {
        let roomKey: string = await generateRoomId(ROOMS);

        ROOMS_MAP.set(roomKey, {
            players: {
                [randomUUID()]: {
                    name: player_name,
                    total: 0,
                    sid: socket.id,
                    status: "NOT_READY"
                }
            },
            rounds: [],
            status: RoomStatus.IDLE,
        });

        let room = ROOMS_MAP.get(roomKey);

        socket.join(roomKey);
        socket.emit(socketEvents.ROOM_INFO, { roomKey, players: room?.players });
    }
}

// join room
export const joinRoom = (socket: Socket, io: Server) => {
    return ({ player_name, roomKey }: { player_name: string, roomKey: string }) => {
        try {
            const room = ROOMS_MAP.get(roomKey);
            if (!room) {
                socket.emit(socketEvents.ERROR, { err: "Room does not exist" });
                logger.warn({ roomKey }, "Room does not exist");
                return;
            }

            // Check if username already exists in the room
            const nameExists = Object.values(room.players).some(
                (player) => player.name === player_name
            );
            if (nameExists) {
                socket.emit(socketEvents.ERROR, { err: "Username already exists in room" });
                logger.warn({ player_name }, "Player name exists");
                return;
            }

            // Add new player
            const playerId = randomUUID();
            room.players[playerId] = {
                name: player_name,
                total: 0,
                sid: socket.id,
                status: "NOT_READY"
            };

            socket.join(roomKey);
            io.to(roomKey).emit(socketEvents.ROOM_INFO, { roomKey, room });
        } catch (error) {
            socket.emit(socketEvents.ERROR, { err: "Failed to join room" });
            logger.error(error);
        }
    }
}

// if all players ready, start game
export const updatePlayerStatus = (socket: Socket, io: Server, disconnectReason?: string) => {
    return ({ status }: { status: Player["status"] }) => {
        // update the players status

        // if all players READY, start game
    }
}


// end game

// declare-death

// spy-guess

// police-guess

// join-allegiance