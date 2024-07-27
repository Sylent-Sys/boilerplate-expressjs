import { EnvSchema } from "@/lib/validate.js";
import { Handler } from "express"
export default (): Handler => async (req, res, next) => {
    try {
        if (process.env.LOG === EnvSchema.shape.LOG.Values.FALSE) return next()
        res.locals.startTime = Date.now();
        res.on('finish', () => {
            console.log(`${req.method} ${req.path} ${res.statusCode} ${new Date().toISOString()} ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} ${Date.now() - res.locals.startTime}ms`);
        });
        next()
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({ msg: error.message })
        } else {
            return res.status(500).json({ msg: "An unexpected error occurred" })
        }
    }
}