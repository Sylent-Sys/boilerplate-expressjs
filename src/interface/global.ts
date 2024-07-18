import { EnvSchema } from '@/lib/validate.js';
import { User } from '@prisma/client';
import { z } from 'zod';

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof EnvSchema> { }
    }
    namespace Express {
        interface Request {
            isAuth: boolean;
            user: User;
        }
    }
}