import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { envConfig } from './config/env';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: envConfig.mode === "development" ?
            true
            :
            [
                "https://kallan-and-police.vercel.app"
            ],
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});