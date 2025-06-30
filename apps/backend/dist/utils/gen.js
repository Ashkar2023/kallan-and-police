import { randomBytes } from "crypto";
import { promisify } from "util";
const randomBytesAsync = promisify(randomBytes);
export const generateRoomId = async (rooms) => {
    let roomKey;
    do {
        roomKey = (await randomBytesAsync(16)).toString("hex");
    } while (rooms.has(roomKey));
    rooms.add(roomKey);
    return roomKey;
};
//# sourceMappingURL=gen.js.map