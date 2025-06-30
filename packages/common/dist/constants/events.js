export var socketEvents;
(function (socketEvents) {
    socketEvents["CREATE_ROOM"] = "CREATE_ROOM";
    socketEvents["ROOM_INFO"] = "ROOM_INFO";
    socketEvents["JOIN_ROOM"] = "JOIN_ROOM";
    socketEvents["EXIT_ROOM"] = "EXIT_ROOM";
    socketEvents["PLAYER_JOINED"] = "PLAYER_JOINED";
    socketEvents["PLAYER_IDLE"] = "PLAYER_IDLE";
    socketEvents["PLAYER_LEFT"] = "PLAYER_LEFT";
    socketEvents["ERROR"] = "ERROR";
})(socketEvents || (socketEvents = {}));
export var gameEvents;
(function (gameEvents) {
    gameEvents["START_GAME"] = "START_GAME";
    gameEvents["END_GAME"] = "END_GAME";
    gameEvents["UPDATE_INFO"] = "UPDATE_INFO";
    gameEvents["DECLARE_DEATH"] = "DECLARE_DEATH";
    gameEvents["POLICE_GUESS"] = "POLICE_GUESS";
    gameEvents["SPY_GUESS"] = "SPY_GUESS";
    gameEvents["JOIN_ALLEGIANCE"] = "JOIN_ALLEGIANCE";
})(gameEvents || (gameEvents = {}));
export var RoomStatus;
(function (RoomStatus) {
    RoomStatus[RoomStatus["IDLE"] = 0] = "IDLE";
    RoomStatus[RoomStatus["IN-PLAY"] = 1] = "IN-PLAY";
    RoomStatus[RoomStatus["END"] = 2] = "END";
})(RoomStatus || (RoomStatus = {}));
