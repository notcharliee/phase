/**
 * Phase configuration object
 */
interface PhaseConfig {
    scripts: {
        app: string;
        build?: string;
        start?: string;
        dev?: string;
    }[];
}
/**
 * @returns Readonly object with string-typed environment variables.
 */
declare const createEnv: <T>(env: T) => Readonly<{ [K in keyof T]: string; }>;
/**
 * Readonly object with string-typed environment variables.
 */
declare const env: Readonly<{
    NODE_ENV: string;
    MONGODB_URI: string;
    DISCORD_TOKEN: string;
    DISCORD_SECRET: string;
    DISCORD_ID: string;
    WEBHOOK_ALERT: string;
    WEBHOOK_STATUS: string;
    API_YOUTUBE: string;
}>;

export { PhaseConfig, createEnv, env };
