import { UUID } from "node:crypto";

export type RoleLiterals = "kallan" | "police" | "minister" | "spy" | "civilian";

export interface BaseRole {
    role: RoleLiterals;
    alive: boolean;
}

export interface Police extends BaseRole {
    role: "police"
}

export interface Kallan extends BaseRole {
    role: "kallan"
    kills: number
}

export interface Minister extends BaseRole {
    role: "minister"
    favor: Extract<RoleLiterals, "kallan" | "police"> | null;
}

export interface Spy extends BaseRole {
    role: "spy"
    guess: number | null;
}

export type IRoles = BaseRole | Police | Kallan | Spy | Minister;

export type RolesForRound = {
    [playerId: UUID]: IRoles;
};

