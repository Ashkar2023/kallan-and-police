import { RoleLiterals, Police, Kallan, Minister, Spy, Civilian, BaseRole } from "common";
import { UUID } from "node:crypto";

export type MainRole = Exclude<RoleLiterals, "civilian" | "spy">;
export type SideRole = Extract<RoleLiterals, "civilian" | "spy">;

const MainRoles = Object.freeze(["kallan", "minister", "police"] as const)
const sideRoles: readonly SideRole[] = Object.freeze(["spy", "civilian"] as const)

// Base class for all roles
export abstract class BaseRoleClass implements BaseRole {
    abstract role: RoleLiterals;
    dead = false;
    score: number = 0;
}

export class PoliceRole extends BaseRoleClass implements Police {
    role: "police" = "police";
    readonly dead: boolean = false
    constructor() {
        super();
    }
}

export class KallanRole extends BaseRoleClass implements Kallan {
    role: "kallan" = "kallan";
    kills: number = 0;
    readonly dead: boolean = false
    constructor() {
        super();
    }
}

export class MinisterRole extends BaseRoleClass implements Minister {
    role: "minister" = "minister";
    favor: "kallan" | "police" | null = null;
    constructor() {
        super();
    }
    set favorSide(value: "kallan" | "police") {
        this.favor = value;
    }
}

export class SpyRole extends BaseRoleClass implements Spy {
    role: "spy" = "spy";
    guess: UUID | null = null;
    constructor() {
        super();
    }
}

export class CivilianRole extends BaseRoleClass implements Civilian {
    role: "civilian" = "civilian";
    constructor() {
        super();
    }
}