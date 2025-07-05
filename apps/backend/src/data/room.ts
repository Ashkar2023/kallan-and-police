import { GameRoom } from "common";

export const ROOMS: Set<string> = new Set();

export const ROOMS_MAP: Map<string, GameRoom> = new Map()

export const ROOMS_EXPIRY_TRACKER: Record<string, number> = {};