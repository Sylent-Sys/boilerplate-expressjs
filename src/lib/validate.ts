import { z } from 'zod';
import { __dirname } from "@/lib/location.js"
import fs from 'fs';
import path from 'path';
const envExampleFilePath = path.resolve(__dirname + "/../../", '.env.example');
const envExampleFileContent = fs.readFileSync(envExampleFilePath, 'utf-8');
const envExampleVariables: { [key: string]: string } = {};
envExampleFileContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envExampleVariables[key.trim()] = value.trim().replaceAll(/"/g, '').replaceAll(/'/g, '').replaceAll(/`/g, '');
    }
});

export const EnvSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    APP_PORT: z.string(),
    LOG: z.enum(["TRUE", "FALSE"]),
});

export const RoleSchema = z.enum(["USER", "ADMIN"]);

const validateEnvExample = EnvSchema.safeParse(envExampleVariables);
const validateEnv = EnvSchema.safeParse(process.env);
if (!validateEnvExample.success) {
    console.error(validateEnvExample.error.errors);
    process.exit(1);
}
if (!validateEnv.success) {
    console.error(validateEnv.error.errors);
    process.exit(1);
}