interface IEnvConfig {
    mode: "development" | "production",
    socketPort: number,
    expressPort: number,
    pinoLogLevel?: string
}

export const envConfig: IEnvConfig = {
    socketPort: Number(process.env.SOCKET_IO_PORT) || 3000,
    expressPort: Number(process.env.EXPRESS_PORT) || 3040,
    mode: (process.env.NODE_ENV === "production" ? "production" : "development"),
    pinoLogLevel: process.env.PINO_LOG_LEVEL || "info"
}