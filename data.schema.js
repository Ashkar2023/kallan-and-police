let players = {
    0: "ashkar",
    1: "hiba",
    2: "shabab",
    3: "althaf",
    4: "fidha"
};

// ROOM

const ROOMS = new Map();

ROOMS["XYHDBA"] = {
    rounds: rounds,
    players,
    totalScores: [], // total accumulated score from rounds
    status: "IDLE" | "IN-PLAY" | "END"
}

// ROUND

let rolesExample = {
    0: { role: Symbol("kallan"), alive: true },// kallan
    1: { role: Symbol("police"), alive: true },// police
    2: { role: Symbol("minister"), alive: true, },// minister, favor: kallan, police or null
    3: { role: Symbol("spy"), guess: 1, alive: true },// spy, guess = player index
    4: { role: Symbol("spy"), guess: 4, alive: true },// spy, guess = player index
    5: { role: Symbol("civilian"), alive: false },// civilian
}

let rounds = [
    {
        roles: rolesExample,
        policeGuess: 0, // index of player
        deaths: [5],
        favor: {
            to: Symbol('kallan'), // minister's favor: kallan, police or null, there is only one minister so stored in round
            about: 5
        },
        status: "STARTING" | "ACTIVE" | "END",
        scores: {
            "0": 0,
            "1": 1.5,
            "2": 2,
            "3": 4,
            "4": 2
        }, //round based scores
        winner: { player: 0, role: Symbol("kallan") }
    }
]