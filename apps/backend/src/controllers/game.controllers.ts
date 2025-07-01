import { gameEvents, ISocketData, ministerFavor, Player, RoomStatus, socketEvents } from "common";
import { randomUUID, UUID } from "node:crypto";
import { Server, Socket } from "socket.io";
import { ROOMS, ROOMS_MAP } from "src/data/room.js";
import { generateRoomId, passwordGen } from "src/utils/room-gen.utils.js";
import logger from "src/utils/logger.js";
import { genRound } from "src/logic/round.js";
import { CivilianRole, KallanRole, MinisterRole, PoliceRole, SpyRole } from "src/entities/roles.model.js";

// create room
export const createRoom = (socket: Socket, io: Server) => {
    return async ({ player_name }: { player_name: string }) => {
        let roomKey: string = await generateRoomId(ROOMS);

        const playerId = randomUUID();
        socket.data.playerId = playerId;

        ROOMS_MAP.set(roomKey, {
            players: {
                [playerId]: {
                    name: player_name,
                    total: 0,
                    sid: socket.id,
                    status: "NOT_READY"
                }
            },
            password: await passwordGen(),
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
    return ({ player_name, roomKey, password }: { player_name: string, roomKey: string, password: string }) => {
        try {
            const room = ROOMS_MAP.get(roomKey);
            if (!room) {
                socket.emit(socketEvents.ERROR, { err: "Room does not exist" });
                logger.warn({ roomKey }, "Room does not exist");
                return;
            }

            if (password !== room.password) {
                socket.emit(socketEvents.ERROR, "Incorrect room password")
                logger.warn({ roomKey }, "Incorrect room password");
            }

            const nameExists = Object.values(room.players).some(
                (player) => (player as Player).name === player_name
            );

            if (nameExists) {
                socket.emit(socketEvents.ERROR, { err: "Username already exists in room" });
                logger.warn({ player_name }, "Player name exists");
                return;
            }

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

export const updatePlayerStatus = (socket: Socket, io: Server, disconnectReason?: string) => {
    return ({ status, roomKey, playerId }: { status: Player["status"], roomKey: string, playerId: UUID }) => {

        const room = ROOMS_MAP.get(roomKey);
        if (!room) return;

        // If player leaves before the game starts (i.e, no rounds), remove them completely
        if (status === "LEFT") {
            if (room.rounds.length === 0) {
                delete room.players[playerId];
                delete socket.data.playerId
            } else {
                room.players[playerId].status = "LEFT";
                delete socket.data.playerId
            }
        } else {
            room.players[playerId].status = status;
        }

        io.to(roomKey).emit(socketEvents.ROOM_INFO, { roomKey, room });
    }
}

// start game
export const startGame = (socket: Socket, io: Server) => {
    return ({ roomKey }: ISocketData) => {
        const room = ROOMS_MAP.get(roomKey);

        if (Object.keys(room?.players as Record<string, Player>).length < 4) {
            socket.emit(socketEvents.ERROR, "Not enough players")
            return
        }

        let allReady = true;

        for (let playerId in room?.players) {
            if (room.players[(playerId as UUID)].status === "NOT_READY") {
                allReady = false;
                break;
            }

            io.emit(gameEvents.START_GAME, { message: "generating round" });

            let round = genRound(room);
            room.rounds.push(round);

            setTimeout(() => {
                io.emit(gameEvents.NEW_ROUND, { roomKey, room })
            }, 2000)
            return
        }

        socket.emit(socketEvents.ERROR, "Players not ready")
    }
}

// round end, return with round & total info, 
// called by another controller, not directly from socket event
export const endRound = (io: Server, roomKey: string) => {
    const room = ROOMS_MAP.get(roomKey);
    if (!room) {
        logger.error("Room not found")
        return
    }
    const round = room.rounds[room.rounds.length - 1];
    const roles = round.roles;
    round.status = "END"
    const BASE = 1;


    for (let playerId in round.roles) {
        const role = roles[playerId as UUID];

        if (role instanceof KallanRole) {
            role.score = round.dead.length * 0.5;
        }

        if (role instanceof PoliceRole) {
            role.score = BASE + round.dead.length * 0.3;
        }

        if (role instanceof CivilianRole) {
            role.score = role.dead ? BASE / 2 : BASE;
        }

        if (role instanceof SpyRole) { // 0.3, 0.5, 0.75, 0.8, 1.0, 1.25
            const guessWorkScore = role.guess === null ? 0 : role.guess === round.kallan ? +0.25 : -0.2;
            role.score = (role.dead ? BASE / 2 : BASE) + guessWorkScore;
        }

        if (role instanceof MinisterRole) {
            const FAVOR_BONUS = 0.25;
            let death = role.dead ? round.dead.length - 1 : round.dead.length;
            let alive = Object.entries(round.roles)
                .filter(([_, r]) => r?.dead === false).length - 2 - (role.dead ? 0 : 1);

            role.score = role.dead ? BASE / 2 : BASE;

            if (role.favor === "kallan" && round.winner === "kallan") {
                role.score += death * FAVOR_BONUS
            }
            if (role.favor === "kallan" && round.winner === "police") {
                role.score += alive * FAVOR_BONUS
            }
        }

    }

    const players = room.players;
    for (let pid in players) {

        if (players[pid as UUID].status !== "LEFT") {
            players[pid as UUID].total += round.roles[pid as UUID]?.score ?? 0
        }
    }

    return io.emit(gameEvents.ROUND_END, { roomKey, room });
}


// nextRound
export const nextRound = (socket: Socket, io: Server) => {
    return ({ roomKey }: ISocketData) => {
        const room = ROOMS_MAP.get(roomKey);
        if (!room) return;

        let lastRound = room.rounds[room.rounds.length - 1];
        if (lastRound.status !== "END") {
            socket.emit(socketEvents.ERROR, "Round in progress")
        }

        const round = genRound(room);
        room.rounds.push(round);

        io.to(roomKey).emit(gameEvents.NEW_ROUND, { roomKey, room });
    }
}

// declare-death
export const declareDead = (socket: Socket, io: Server) => {
    return ({ roomKey }: ISocketData) => {
        const room = ROOMS_MAP.get(roomKey);
        if (!room) return
        const round = room?.rounds[room.rounds.length - 1]
        if (!round) return

        const playerId = socket.data.playerId;
        if (playerId in round.roles && !round.roles[playerId]?.dead === false) {
            round.roles[playerId].dead = true;
        }

        round.dead.push(playerId);

        const alivePlayers = Object.entries(round.roles)
            .filter(([pid, role]) => role && role.dead === false)
            .map(([pid, _]) => pid);

        const kallanId = round.kallan;
        const policeId = round.police;

        if (
            alivePlayers.length === 2 &&
            alivePlayers.includes(kallanId) &&
            alivePlayers.includes(policeId)
        ) {
            round.winner = "kallan";
            round.status = "END"

            io.to(roomKey).emit(gameEvents.WINNER, {
                roomKey,
                winner: "kallan",
                wid: playerId,
                message: "Kallan wins the round"
            });
            endRound(io, roomKey);
        }

        io.to(roomKey).emit(gameEvents.DEAD, { player: socket.data.playerId })
    }
}

// spy-guess
export const spyGuess = (socket: Socket, io: Server) => {
    return ({ roomKey, targetPlayerId }: { roomKey: string, targetPlayerId: UUID }) => {
        const room = ROOMS_MAP.get(roomKey);
        if (!room) {
            logger.warn({ roomKey, event: gameEvents.SPY_GUESS }, "Room does not exist for spy guess");
            return;
        }

        const currentRound = room.rounds[room.rounds.length - 1];
        if (currentRound.status === "END") {
            logger.warn({ roomKey, event: gameEvents.SPY_GUESS }, "No active round for spy guess");
            return;
        }

        const playerId = socket.data.playerId;
        const playerRole = currentRound.roles[playerId];

        // Check if player is spy
        if (!playerRole || playerRole.role !== "spy") {
            logger.warn({ playerId, roomKey, event: gameEvents.SPY_GUESS }, "Player is not a spy");
            return;
        }

        // Store the spy's guess in their role object
        playerRole.guess = targetPlayerId;

        logger.info({ spyId: playerId, targetId: targetPlayerId, roomKey }, "Spy made a guess");

        socket.emit(gameEvents.SPY_GUESS, { roomKey, spyId: playerId, message: "guess recorded" });
    }
}

// police-guess
export const policeGuess = (socket: Socket, io: Server) => {
    return ({ roomKey, targetPlayerId }: { roomKey: string, targetPlayerId: UUID }) => {
        const room = ROOMS_MAP.get(roomKey);
        if (!room) {
            logger.warn({ roomKey, event: gameEvents.POLICE_GUESS }, "Room does not exist for police guess");
            return;
        }

        const currentRound = room.rounds[room.rounds.length - 1];
        if (currentRound.status === "END") {
            logger.warn({ roomKey, event: gameEvents.POLICE_GUESS }, "No active round for police guess");
            return;
        }

        const playerId = socket.data.playerId;
        const playerRole = currentRound.roles[playerId];

        // Check if player is police
        if (!playerRole || playerRole.role !== "police") {
            logger.warn({ playerId, roomKey, event: gameEvents.POLICE_GUESS }, "Player is not a police");
            return;
        }

        // Find the kallan in the current round
        const kallanPlayerId = Object.keys(currentRound.roles).find(
            (pid) => currentRound.roles[pid as UUID]?.role === "kallan"
        );

        currentRound.policeGuess = targetPlayerId;

        if (targetPlayerId === kallanPlayerId) {
            logger.info({ policeId: playerId, kallanId: kallanPlayerId, roomKey }, "Police correctly guessed kallan");

            io.to(roomKey).emit(gameEvents.WINNER, {
                roomKey,
                winner: "police",
                wid: playerId,
                message: "Police wins the round"
            });
            currentRound.winner = "police";

            endRound(io, roomKey);
        } else {
            logger.info({ policeId: playerId, targetId: targetPlayerId, actualKallanId: kallanPlayerId, roomKey }, "Police incorrectly guessed kallan");

            io.to(roomKey).emit(gameEvents.WINNER, {
                roomKey,
                winner: "kallan",
                wid: kallanPlayerId,
                message: "Police's guessed incorrect."
            });
            currentRound.winner = "kallan";

            endRound(io, roomKey);
        }
    }
}

// join-allegiance
export const joinAllegiance = (socket: Socket, io: Server) => {
    return ({ roomKey, favor }: { roomKey: string, favor: NonNullable<ministerFavor> }) => {
        const room = ROOMS_MAP.get(roomKey);
        if (!room) return;

        const currentRound = room.rounds[room.rounds.length - 1];
        if (currentRound.status === "END") return;

        const ministerId = socket.data.playerId;
        const playerRole = currentRound.roles[ministerId];

        if (!playerRole || playerRole.role !== "minister") return;

        playerRole.favor = favor;

        let recipient: UUID;

        for (let playerId in room?.players) {
            let roles = currentRound.roles;

            if (roles[(playerId as UUID)] instanceof KallanRole && playerRole.favor === "kallan") {
                recipient = playerId as UUID;
            }
            if (roles[(playerId as UUID)] instanceof PoliceRole && playerRole.favor === "police") {
                recipient = playerId as UUID
            }
        }

        io.to(room.players[recipient! as UUID].sid).emit(gameEvents.ALLEGIANCE_RECEIVED, { message: "minister has spotted a civilian for you" })
    }
}

// end game
export const endGame = (socket: Socket, io: Server) => {
    return ({ roomKey }: { roomKey: string }) => {
        const room = ROOMS_MAP.get(roomKey);
        if (!room) return;
        // Gather player data
        const playersArr = Object.values(room.players).map(player => ({
            name: player.name,
            score: player.total
        }));
        // Sort by score descending
        playersArr.sort((a, b) => b.score - a.score);
        // Emit the sorted results
        io.to(roomKey).emit(gameEvents.END_GAME, { roomKey, results: playersArr });
    };
}

// Attach all game and socket event listeners to the socket
export const attachGameListeners = (socket: Socket, io: Server) => {
    socket.on(socketEvents.CREATE_ROOM, createRoom(socket, io));
    socket.on(socketEvents.JOIN_ROOM, joinRoom(socket, io));

    socket.on(gameEvents.START_GAME, startGame(socket, io));
    socket.on(gameEvents.END_GAME, endGame(socket, io));
    socket.on(gameEvents.NEW_ROUND, nextRound(socket, io));
    socket.on(gameEvents.DEAD, declareDead(socket, io));
    socket.on(gameEvents.SPY_GUESS, spyGuess(socket, io));
    socket.on(gameEvents.POLICE_GUESS, policeGuess(socket, io));
    socket.on(gameEvents.JOIN_ALLEGIANCE, joinAllegiance(socket, io));
    // Add more gameEvents as needed
}