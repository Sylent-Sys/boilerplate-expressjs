import { Handler } from "express";
import AuthService from "../../service/auth.service.js";
import userCreateDto from "@/dto/user.create.dto.js";
import { ZodError } from "zod";

export const post: Handler = async (req, res) => {
    try {
        const validateBody = userCreateDto.safeParse(req.body);
        if (!validateBody.success) {
            throw new ZodError(validateBody.error.errors);
        }
        const result = await new AuthService().register({ ...req.body });
        return res.json({
            msg: "User registered successfully",
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
};