import { UUID } from "node:crypto";
import { Kallan, Player, Police, RoleLiterals, RolesForRound } from "./player.types.js";
import { RoomStatus } from "../constants/events.js";

export interface GameRoom {
    rounds: Round[];
    players: Record<UUID, Player>;
    status: RoomStatus;
    password: string;
}

export type RoundStatus = "ACTIVE" | "END";

export interface Round {
    roles: RolesForRound;
    policeGuess: UUID | null;
    winner: Extract<RoleLiterals, "police" | "kallan"> | null;
    police: UUID
    kallan: UUID
    dead: UUID[];
    status: RoundStatus;
} 