export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // PORT: number | string | undefined;
      HOSTNAME: string;
      NODE_ENV: "development" | "production" | "test";
      BASEURL: string;
      JWTTOKEN: string;

      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_URL: string;
      // DB_PORT: number | string | undefined;
      DB_NAME: string;

      DATABASE_URL: string;
    }
  }
}