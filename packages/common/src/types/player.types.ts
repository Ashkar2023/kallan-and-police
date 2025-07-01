import { UUID } from "node:crypto";

export type Player = {
    name: string;
    total: number;
    sid: string;
    status: "READY" | "NOT_READY" | "IDLE" | "LEFT" ;
};

export type RoleLiterals = "kallan" | "police" | "minister" | "spy" | "civilian";

export interface BaseRole {
    role: RoleLiterals;
    dead: boolean;
    score: number;
}

export interface Police extends BaseRole {
    role: "police"
}

export interface Kallan extends BaseRole {
    role: "kallan"
    kills: number
}

export type ministerFavor = Extract<RoleLiterals, "kallan" | "police"> | null;

export interface Minister extends BaseRole {
    role: "minister"
    favor: ministerFavor;
}

export interface Spy extends BaseRole {
    role: "spy"
    guess: UUID | null;
}

export interface Civilian extends BaseRole {
    role: "civilian"
}

export type IRoles =  Police | Kallan | Spy | Minister | Civilian ;

export type RolesForRound = {
    [playerId: UUID]: IRoles | null;
};

