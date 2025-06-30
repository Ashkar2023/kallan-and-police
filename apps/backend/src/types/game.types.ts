import { UUID } from "node:crypto";
import { RoomStatus } from "@/constants/events.js";
import { Kallan, Police, RoleLiterals, RolesForRound } from "@/types/player.types.js"
import { Player } from "common";

export interface Room {
    rounds: Round[];
    players: Record<UUID, Player>;
    status: RoomStatus;
}

export type RoundStatus = "STARTING" | "ACTIVE" | "END";

export interface Round {
    roles: RolesForRound;
    policeGuess: UUID | null;
    winner: Extract<RoleLiterals, "police" | "kallan">;
    police: Police
    kallan: Kallan
    deaths: UUID[];
    status: RoundStatus;
    scores: {
        [id: UUID]: number
    };
} 