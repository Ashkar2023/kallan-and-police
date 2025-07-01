export const getRoleCounts = (activePlayers: string[]) => {
    let remaining = activePlayers.length - 3;
    let spies = Math.floor(remaining / 3);
    let civilians = remaining - spies;

    return { spies, civilians }
}

// Factory-function
export function generateRoles<T>(RoleClass: new () => T, count: number) {
    return Array.from({ length: count }, () => new RoleClass())
}