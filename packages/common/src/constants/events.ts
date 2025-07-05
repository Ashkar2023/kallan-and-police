export enum socketEvents {
    CREATE_ROOM = "CREATE_ROOM",
    ROOM_INFO = "ROOM_INFO",

    JOIN_ROOM = "JOIN_ROOM",
    EXIT_ROOM = "EXIT_ROOM",

    PLAYER_JOINED = "PLAYER_JOINED",
    PLAYER_IDLE = "PLAYER_IDLE",
    PLAYER_LEFT = "PLAYER_LEFT",
    CLEAN_UP = "CLEAN_UP",

    ERROR = "ERROR"
}


export enum gameEvents {
    START_GAME = "START_GAME",

    NEW_ROUND = "NEW_ROUND", // used for user input for generating new round and for server to send generated round
    ROUND_END = "ROUND_END",
    BREAK = "BREAK",

    DEAD = "DEAD",

    POLICE_GUESS = "POLICE_GUESS",
    SPY_GUESS = "SPY_GUESS",
    WINNER = "WINNER",

    JOIN_ALLEGIANCE = "JOIN_ALLEGIANCE",
    ALLEGIANCE_RECEIVED = "ALLEGIANCE_RECEIVED",

    END_GAME = "END_GAME",
    UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS",
}

export enum RoomStatus { "JOINING", "LOBBY", "LOADING", "IN-PLAY", "BREAK", "END" } 