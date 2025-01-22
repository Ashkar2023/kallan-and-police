import { Server, Socket } from 'socket.io';

export const joinRoom = (socket: Socket, io: Server) => {
    return (data) => {
        socket.join(room);
        socket.to(room).emit('message', `${socket.id} has joined the room ${room}`);
    }
};

export const leaveRoom = (socket: Socket, io: Server) => {
    return (data) => {
        socket.join(room);
        socket.to(room).emit('message', `${socket.id} has joined the room ${room}`);
    }
};