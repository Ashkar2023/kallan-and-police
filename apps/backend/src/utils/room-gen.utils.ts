import { randomBytes } from "crypto";
import { promisify } from "util";

const randomBytesAsync = promisify(randomBytes);

export const generateRoomId = async (rooms: Set<string>): Promise<string> => {
    let roomKey: string;

    do {
        roomKey = (await randomBytesAsync(3)).toString("hex").toUpperCase();
    } while (rooms.has(roomKey));

    rooms.add(roomKey);
    return roomKey;
};

export const passwordGen = async (): Promise<string> => {
    const password: string = Math.floor(Math.random() * 100).toString().padStart(2,"0");
    return password
}

