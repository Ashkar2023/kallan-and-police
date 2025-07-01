import { GameRoom, IRoles, RolesForRound, Round } from "common";
import { UUID } from "node:crypto";
import { CivilianRole, KallanRole, MinisterRole, PoliceRole, SpyRole } from "src/entities/roles.model.js";
import { generateRoles, getRoleCounts } from "src/utils/round-gen.utils.js";


export const genRound = (room: GameRoom): Round | never => {
    let baseRound: Omit<Round, "kallan" | "police"> = {
        dead: [],
        policeGuess: null,
        status: "ACTIVE",
        winner: null,
        roles: {}
    };

    let activePlayers = Object.keys(room.players).filter(playerId => room.players[playerId as UUID].status !== "LEFT");

    const { spies, civilians } = getRoleCounts(activePlayers);

    let roles = [
        new PoliceRole(),
        new KallanRole(),
        new MinisterRole(),
        ...generateRoles(SpyRole, spies),
        ...generateRoles(CivilianRole, civilians),
    ]

    // The idea of generation is to attatch shuffled role object to ordered UUID's
    let shuffledRoles = shuffle(roles);
    let rolesForRound: RolesForRound = {};
    let kallan: UUID, police: UUID;

    for (let playerId in room.players) {
        if (!activePlayers.includes(playerId)) {
            rolesForRound[playerId as UUID] = null;
        }

        let role = shuffledRoles.shift()!;
        rolesForRound[playerId as UUID] = role;

        if (role instanceof KallanRole) {
            kallan = playerId as UUID;
        }

        if (role instanceof PoliceRole) {
            police = playerId as UUID;
        }
    }

    if (!kallan! || !police!) {
        throw new Error("Kallan OR police has not been assigned")
    }

    return {
        ...baseRound,
        roles: rolesForRound,
        police: police,
        kallan: kallan
    }
}

// fisher-yates algorithm
const shuffle = (roles: IRoles[]) => {
    let shuffled = roles.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]]
    }

    return shuffled;
}

