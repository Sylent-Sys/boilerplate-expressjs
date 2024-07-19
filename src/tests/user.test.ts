import { test, describe, expect } from 'vitest';
import request from "supertest";
import server from "@/lib/server.js"
import UserService from '@/service/user.service.js';
import { prisma } from '@/lib/prisma.js';
import { RoleSchema } from '@/lib/validate.js';
describe("Test the Auth Path", () => {
    test("Me Path Success", async () => {
        await new UserService().create({ email: "user_user_dummy@user.com", password: "user" });
        const login = await request(server).post("/auth/login").send({ email: "user_user_dummy@user.com", password: "user" }).expect(200);
        const result = await request(server).get("/user/me").set("Authorization", `Bearer ${login.body.token}`).expect(200);
        expect(result.body, "Success Have User").toHaveProperty("data");
        await prisma.user.deleteMany({ where: { email: "user_user_dummy@user.com" } });
    });
    test("Me Path Fail", async () => {
        const result = await request(server).get("/user/me").set("Authorization", `Bearer ${"dummy"}`).expect(400);
        expect(result.body, "Fail Have User").toHaveProperty("msg");
    });
    test("Update Path Success", async () => {
        await new UserService().create({ email: "user_user_dummy@user.com", password: "user" });
        await new UserService().create({ email: "admin_user_dummy@admin.com", password: "admin" });
        await prisma.user.update({ where: { email: "admin_user_dummy@admin.com" }, data: { role: RoleSchema.Values.ADMIN } });
        const adminToken = await request(server).post("/auth/login").send({ email: "admin_user_dummy@admin.com", password: "admin" }).expect(200);
        const userToken = await request(server).post("/auth/login").send({ email: "user_user_dummy@user.com", password: "user" }).expect(200);
        const userData = await request(server).get("/user/me").set("Authorization", `Bearer ${userToken.body.token}`).expect(200);
        const result = await request(server).put(`/user/${userData.body.data.id}`).set("Authorization", `Bearer ${adminToken.body.token}`).send({ email: "user_user_dummy123@user.com", role: RoleSchema.Values.ADMIN }).expect(200);
        expect(result.body, "Success Update User").toHaveProperty("msg");
        expect(result.body, "Success Update User").toHaveProperty("user");
        const user = await prisma.user.findUnique({ where: { id: userData.body.data.id } });
        expect(user, "Success Update User").toHaveProperty("email", "user_user_dummy123@user.com");
        expect(user, "Success Update User").toHaveProperty("role", RoleSchema.Values.ADMIN);
        await prisma.user.deleteMany({ where: { id: userData.body.data.id } });
        await prisma.user.deleteMany({ where: { email: "admin_user_dummy@admin.com" } });
    });
    test("Update Path Fail", async () => {
        await new UserService().create({ email: "user_user_dummy@user.com", password: "user" });
        await new UserService().create({ email: "admin_user_dummy@admin.com", password: "admin" });
        const adminToken = await request(server).post("/auth/login").send({ email: "admin_user_dummy@admin.com", password: "admin" }).expect(200);
        const userToken = await request(server).post("/auth/login").send({ email: "user_user_dummy@user.com", password: "user" }).expect(200);
        const userData = await request(server).get("/user/me").set("Authorization", `Bearer ${userToken.body.token}`).expect(200);
        const result = await request(server).put(`/user/${userData.body.data.id}`).set("Authorization", `Bearer ${adminToken.body.token}`).send({ email: "user_user_dummy123@user.com", password: "user", role: RoleSchema.Values.ADMIN }).expect(400);
        expect(result.body, "Success Update User").toHaveProperty("error");
        await prisma.user.deleteMany({ where: { id: userData.body.data.id } });
        await prisma.user.deleteMany({ where: { email: "admin_user_dummy@admin.com" } });
    });
    test("Delete Path Success", async () => {
        await new UserService().create({ email: "user_user_dummy@user.com", password: "user" });
        await new UserService().create({ email: "admin_user_dummy@admin.com", password: "admin" });
        await prisma.user.update({ where: { email: "admin_user_dummy@admin.com" }, data: { role: RoleSchema.Values.ADMIN } });
        const adminToken = await request(server).post("/auth/login").send({ email: "admin_user_dummy@admin.com", password: "admin" }).expect(200);
        const userToken = await request(server).post("/auth/login").send({ email: "user_user_dummy@user.com", password: "user" }).expect(200);
        const userData = await request(server).get("/user/me").set("Authorization", `Bearer ${userToken.body.token}`).expect(200);
        const result = await request(server).delete(`/user/${userData.body.data.id}`).set("Authorization", `Bearer ${adminToken.body.token}`).expect(200);
        expect(result.body, "Success Delete User").toHaveProperty("msg");
        const user = await prisma.user.findUnique({ where: { id: userData.body.data.id } });
        expect(user, "Success Delete User").toBeNull();
        await prisma.user.deleteMany({ where: { id: userData.body.data.id } });
        await prisma.user.deleteMany({ where: { email: "admin_user_dummy@admin.com" } });
    });
    test("Delete Path Fail", async () => {
        await new UserService().create({ email: "user_user_dummy@user.com", password: "user" });
        await new UserService().create({ email: "admin_user_dummy@admin.com", password: "admin" });
        const adminToken = await request(server).post("/auth/login").send({ email: "admin_user_dummy@admin.com", password: "admin" }).expect(200);
        const userToken = await request(server).post("/auth/login").send({ email: "user_user_dummy@user.com", password: "user" }).expect(200);
        const userData = await request(server).get("/user/me").set("Authorization", `Bearer ${userToken.body.token}`).expect(200);
        const result = await request(server).delete(`/user/${userData.body.data.id}`).set("Authorization", `Bearer ${adminToken.body.token}`).expect(400);
        expect(result.body, "Success Update User").toHaveProperty("error");
        await prisma.user.deleteMany({ where: { id: userData.body.data.id } });
        await prisma.user.deleteMany({ where: { email: "admin_user_dummy@admin.com" } });
    });
});