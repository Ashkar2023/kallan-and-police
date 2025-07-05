import { playerData } from "@/types/atom.types";
import { GameRoom, RoomStatus } from "common"
import { UUID } from "crypto"
import { atomWithStorage } from "jotai/utils"

export const _$InitGameRoom: GameRoom = {
    roomId: "",
    password: "",
    players: {},
    rounds: [],
    status: RoomStatus.JOINING,
    host: null as unknown as UUID
}

export const _$InitPlayerData: playerData = {
    name: "",
    playerId: "",
    sid: ""
}

export const $gameRoom = atomWithStorage<GameRoom | null>('room',
    null,
    undefined,
    {
        getOnInit: true
    }
);
export const $playerdData = atomWithStorage<playerData | null>("playerData", null, undefined, { getOnInit: true })