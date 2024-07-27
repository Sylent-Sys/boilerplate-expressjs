import { RoleSchema } from '@/lib/validate.js';
import { PrismaClient } from '@prisma/client'
import * as argon2 from "argon2";
async function init() {
    const prisma = new PrismaClient()
    await prisma.user.deleteMany()
    await prisma.user.create({
        data: {
            email: 'user@user.com',
            password: await argon2.hash('user'),
            role: RoleSchema.Values.USER,
        },
    })
    await prisma.user.create({
        data: {
            email: 'admin@admin.com',
            password: await argon2.hash('admin'),
            role: RoleSchema.Values.ADMIN,
        },
    })
    await prisma.$disconnect()
}
init()