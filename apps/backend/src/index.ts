import { Server, Socket } from 'socket.io';
import { envConfig } from './config/env.js';
import { createServer } from 'node:http';
import { attachGameListeners } from './controllers/game.controllers.js';
import logger from './utils/logger.js';

const server = createServer();
const io = new Server(server);

io.on('connection', (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    attachGameListeners(socket, io);

    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
        // update the room player status and update the room info
    });
});

const PORT = envConfig.socketPort || 3000;
server.listen(PORT, '0.0.0.0', () => {
    logger.info(`Socket.IO server started at http://0.0.0.0:${PORT}`);
});

// process.on("unhandledRejection")
// process.on("uncaughtException")
// process.on("SIG")