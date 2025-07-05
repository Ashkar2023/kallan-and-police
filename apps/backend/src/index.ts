import { Server, Socket } from 'socket.io';
import { envConfig } from './config/env.js';
import { createServer } from 'node:http';
import { attachGameListeners } from './controllers/game.controllers.js';
import logger from './utils/logger.js';
import { gameEvents, socketEvents } from 'common';
import cron from "node-cron";
import { ROOMS_EXPIRY_TRACKER } from './data/room.js';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { task } from './utils/expiry.task.js';

const server = createServer();
const io = new Server(server);

io.on('connection', (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.prependAny((en: socketEvents | gameEvents, ...args) => {
        if (en !== socketEvents.CREATE_ROOM && socket.data.roomId) {
            ROOMS_EXPIRY_TRACKER[socket.data.roomId] = Date.now() + 5 * 60 * 1000;
        }
    })

    attachGameListeners(socket, io);

    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
        socket.offAny()

        /**
         *  update the room.player status and update send ROOM_INFO
          */
    });
});

const PORT = envConfig.socketPort || 3000;
server.listen(PORT, '0.0.0.0', () => {
    logger.info(`Timezone: ${process.env.TZ}`);
    logger.info(`Socket.IO server started at http://0.0.0.0:${PORT}`);
});

// const taskFilePath = resolve("./utils/expiry.task.js");
const clean_rooms = cron.schedule("*/5 * * * * *", task)

// process.on("unhandledRejection")
// process.on("uncaughtException")
// process.on("SIG")