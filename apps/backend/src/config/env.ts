interface IEnvConfig {
    mode: "development" | "production",
    socketPort: number,
    expressPort: number
}

export const envConfig: IEnvConfig = {
    socketPort: Number(process.env.SOCKET_IO_PORT) || 3030,
    expressPort: Number(process.env.EXPRESS_PORT) || 3000,
    mode: (process.env.NODE_ENV === "production" ? "production" : "development"),
}