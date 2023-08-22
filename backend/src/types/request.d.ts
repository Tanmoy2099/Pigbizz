export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // PORT: number | string;
            HOSTNAME: string;
            NODE_ENV: "development" | "production" | "test";
        }
    }
}