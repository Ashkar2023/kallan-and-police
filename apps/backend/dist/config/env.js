export const envConfig = {
    socketPort: Number(process.env.SOCKET_IO_PORT) || 3000,
    expressPort: Number(process.env.EXPRESS_PORT) || 3040,
    mode: (process.env.NODE_ENV === "production" ? "production" : "development"),
};
//# sourceMappingURL=env.js.map