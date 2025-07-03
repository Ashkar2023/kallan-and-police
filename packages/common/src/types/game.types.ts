import { UUID } from "node:crypto";
import { Player, RoleLiterals, RolesForRound } from "./player.types.js";
import { RoomStatus } from "../constants/events.js";

export interface GameRoom {
    rounds: Round[];
    players: Record<UUID, Player>;
    status: RoomStatus;
    password: string;
    host: UUID
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