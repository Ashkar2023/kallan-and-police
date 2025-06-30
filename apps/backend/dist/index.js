import { Server } from 'socket.io';
import { envConfig } from './config/env.js';
import { createServer } from 'node:http';
import { socketEvents } from "common";
import { createRoom } from './controllers/game.controllers.js';
import logger from './utils/logger.js';
const server = createServer();
const io = new Server(server);
io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    socket.on(socketEvents.CREATE_ROOM, createRoom(socket, io));
    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});
const started = io.listen(envConfig.socketPort);
if (started) {
    logger.info("server started @", envConfig.socketPort);
}
//# sourceMappingURL=index.js.map