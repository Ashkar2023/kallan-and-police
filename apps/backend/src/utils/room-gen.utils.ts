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

export const passwordGen = async (): Promise<string> =>{
    const password:string = (await randomBytesAsync(2)).toString("hex");
    return password.toUpperCase()
}

