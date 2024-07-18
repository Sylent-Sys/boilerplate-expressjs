import userUpdateDto from "@/dto/user.update.dto.js";
import { prisma } from "@/lib/prisma.js";
import { User } from "@prisma/client";
import * as argon2 from "argon2";
import { z } from "zod";
export default class UserService {
    async findUnique({ email }: Pick<User, "email">) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async create({ email, password }: Pick<User, "email" | "password">) {
        const user = await this.findUnique({ email });
        if (user) {
            throw new Error("User already exists");
        }
        const hash = await argon2.hash(password);
        const result = await prisma.user.create({
            data: {
                email,
                password: hash,
            },
        });
        return {
            email: result.email,
            role: result.role,
        };
    }
    async update({ email, id, password, role }: z.infer<typeof userUpdateDto>) {
        if (password) {
            password = await argon2.hash(password);
        }
        if (email) {
            const user = await this.findUnique({ email });
            if (user && user.id !== id) {
                throw new Error("Email already exists");
            }
        }
        const result = await prisma.user.update({
            where: {
                id,
            },
            data: {
                email,
                password,
                role,
            },
        });
        return {
            id: result.id,
            email: result.email,
            role: result.role,
        };
    }
}