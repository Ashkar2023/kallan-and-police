import { UUID } from "node:crypto";
import { Kallan, Player, Police, RoleLiterals, RolesForRound } from "./player.types.js";
import { RoomStatus } from "../constants/events.js";

export interface Room {
    rounds: Round[];
    players: Record<UUID, Player>;
    status: RoomStatus;
    password: string
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