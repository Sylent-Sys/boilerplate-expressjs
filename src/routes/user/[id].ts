import userUpdateDto from "@/dto/user.update.dto.js";
import authJwt from "@/middleware/authJwt.js";
import authorization from "@/middleware/authorization.js";
import UserService from "@/service/user.service.js";
import { Handler } from "express";
import { ZodError } from "zod";

export const put: Handler[] = [
    authJwt(),
    authorization(["ADMIN"]),
    async (req, res) => {
        try {
            if (!req.params.id) {
                throw new Error("User ID is required");
            }
            const validateBody = userUpdateDto.safeParse({ ...req.body, id: req.params.id });
            if (!validateBody.success) {
                throw new ZodError(validateBody.error.errors);
            }
            const result = await new UserService().update({ ...validateBody.data });
            return res.json({
                msg: "User updated successfully",
                user: result,
            });
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({ msg: error.format() });
            } else if (error instanceof Error) {
                return res.status(400).json({ msg: error.message });
            } else {
                return res.status(500).json({ msg: "An unexpected error occurred" });
            }
        }
    }
];

export const del: Handler[] = [
    authJwt(),
    authorization(["ADMIN"]),
    async (req, res) => {
        try {
            if (!req.params.id) {
                throw new Error("User ID is required");
            }
            await new UserService().delete({ id: req.params.id });
            return res.json({
                msg: "User deleted successfully",
            });
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(400).json({ msg: error.format() });
            } else if (error instanceof Error) {
                return res.status(400).json({ msg: error.message });
            } else {
                return res.status(500).json({ msg: "An unexpected error occurred" });
            }
        }
    }
];