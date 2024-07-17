import { EnvSchema } from '@/lib/validate.js';
import { z } from 'zod';

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof EnvSchema> { }
    }
}