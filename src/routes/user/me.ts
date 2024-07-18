import authJwt from "@/middleware/authJwt.js";
import { Handler } from "express";

export const get: Handler[] = [
    authJwt()
    , async (req, res) => {
        try {
            return res.json({
                data: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                },
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(400).json({ msg: error.message });
            } else {
                return res.status(500).json({ msg: "An unexpected error occurred" });
            }
        }
    }];