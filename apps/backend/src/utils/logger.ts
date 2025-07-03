import { pino } from "pino";
import { envConfig } from "../config/env.js";
import stream from "pino-pretty"

export default pino(
    {
        level: envConfig.pinoLogLevel || "info",
        timestamp: () => {
            return `,"time":"${new Date(Date.now()).toLocaleTimeString()}"`
        },
    },
    envConfig.mode === "development" ? (
        stream({
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
        })
    ) : undefined,
)