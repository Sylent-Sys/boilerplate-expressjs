import { Handler } from "express"
import { prisma } from "@/lib/prisma.js"
import * as jose from "jose"
export default (): Handler => async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
        if (!bearerToken) return res.status(400).json({ error: "Missing bearer token" })
        if (!bearerToken.startsWith("Bearer ")) return res.status(400).json({ error: "Invalid bearer token" })
        const token = bearerToken.split(" ")[1]
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string)
        const jwt = await jose.jwtVerify(token, secret, { algorithms: ['HS256'] })
        const user = await prisma.user.findFirst({
            where: {
                email: jwt.payload.email as string
            }
        })
        if (!user) return res.status(400).json({ error: "User not found" })
        req.user = user
        req.isAuth = true
        next()
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({ msg: error.message })
        } else {
            return res.status(500).json({ msg: "An unexpected error occurred" })
        }
    }
}