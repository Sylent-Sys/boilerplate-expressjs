import { RoleSchema } from "@/lib/validate.js";
import { z } from "zod";

export default z.object({
    id: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    role: RoleSchema.optional(),
})