import { User } from "@prisma/client";
import * as argon2 from "argon2";
import * as jose from 'jose'
import UserService from "./user.service.js";
export default class AuthService {
    async register({ email, password }: Pick<User, "email" | "password">) {
        return await new UserService().create({ email, password });
    }
    async login({ email, password }: Pick<User, "email" | "password">) {
        const user = await new UserService().findUnique({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            throw new Error("Invalid password");
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string)
        const token = await new jose.SignJWT({
            email,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("2h")
            .sign(secret);
        return token;
    }
}