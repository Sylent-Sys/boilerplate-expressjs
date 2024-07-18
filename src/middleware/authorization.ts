import { RoleSchema } from "@/lib/validate.js"
import { Handler } from "express"
import { z } from "zod"
export default (allowedRole: z.infer<typeof RoleSchema>[]): Handler => async (req, res, next) => {
    try {
        if (!req.isAuth) return res.status(400).json({ error: "Unauthorized" })
        const validateRole = RoleSchema.safeParse(req.user.role)
        if (!validateRole.success) return res.status(400).json({ error: "Invalid role" })
        if (!allowedRole.includes(validateRole.data)) return res.status(400).json({ error: "Forbidden" })
        next()
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({ msg: error.message })
        } else {
            return res.status(500).json({ msg: "An unexpected error occurred" })
        }
    }
}