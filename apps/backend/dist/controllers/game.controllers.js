import { ROOMS_MAP, ROOMS } from "../data/index.js";
import { generateRoomId } from "../utils/gen.js";
import { RoomStatus, socketEvents } from "common";
// create room
export const createRoom = (socket, io) => {
    return async ({ player_name }) => {
        let roomKey = await generateRoomId(ROOMS);
        ROOMS_MAP.set(roomKey, {
            players: {
                "0": {
                    name: player_name,
                    status: "NOT_READY"
                }
            },
            status: RoomStatus.IDLE,
            totalScores: []
        });
        let room = ROOMS_MAP.get(roomKey);
        socket.join(roomKey);
        socket.emit(socketEvents.ROOM_INFO, { roomKey, players: room?.players });
    };
};
// join room
export const joinRoom = (socket, io) => {
    return ({ player_name, roomKey }) => {
    };
};
// start game
// end game
// declare-death
// spy-guess
// police-guess
// join-allegiance
//# sourceMappingURL=game.controllers.js.map