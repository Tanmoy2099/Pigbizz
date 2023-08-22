export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PORT: number;
      NEXT_PUBLIC_HOSTNAME: string;
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_PORT: number;
      NEXT_PUBLIC_HOSTNAME: string;
      NEXT_PUBLIC_BACKEND_BASEURL: string;
      NEXT_PUBLIC_JWTTOKEN: string;

      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_URL: string;
      DB_PORT: number;
      DB_NAME: string;

      DATABASE_URL: string;
    }
  }
}