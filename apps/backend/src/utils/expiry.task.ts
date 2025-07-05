import { ROOMS, ROOMS_EXPIRY_TRACKER, ROOMS_MAP } from "../data/room.js"
import logger from "./logger.js";

export function task(){
    console.log(ROOMS);
    console.log(ROOMS_MAP);
    console.log(ROOMS_EXPIRY_TRACKER);
    
    for (let [roomId, expiry] of Object.entries(ROOMS_EXPIRY_TRACKER)) {
        if(Date.now() >= expiry){
            ROOMS.delete(roomId);
            ROOMS_MAP.delete(roomId);
            delete ROOMS_EXPIRY_TRACKER[roomId];

            logger.info("room cleared")
        }
    }
}