export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_PORT: number;
            NEXT_PUBLIC_HOSTNAME: string;
            NODE_ENV: "development" | "production" | "test";
        }
    }
}