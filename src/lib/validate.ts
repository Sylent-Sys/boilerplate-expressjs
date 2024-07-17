import { z } from 'zod';

export const EnvSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    APP_PORT: z.string(),
});

const validateEnv = EnvSchema.safeParse(process.env);
if (!validateEnv.success) {
    console.error(validateEnv.error.errors);
    process.exit(1);
}