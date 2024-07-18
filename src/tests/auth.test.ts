import { test, describe, expect } from 'vitest';
import request from "supertest";
import server from "@/lib/server.js"
import UserService from '@/service/user.service.js';
import { prisma } from '@/lib/prisma.js';
describe("Test the Auth Path", () => {
    test("Login Path Success", async () => {
        await new UserService().create({ email: "admin_dummy@admin.com", password: "admin" });
        const result = await request(server).post("/auth/login").send({ email: "admin_dummy@admin.com", password: "admin" }).expect(200);
        expect(result.body, "Success Have Token").toHaveProperty("token");
        await prisma.user.deleteMany({ where: { email: "admin_dummy@admin.com" } });
    });
    test("Login Path Malformed Email", async () => {
        const result = await request(server).post("/auth/login").send({ email: "admin_dummy", password: "admin" }).expect(400);
        expect(result.body, "Have Error Message").toHaveProperty("msg");
    });
    test("Login Path Missing One Property", async () => {
        const result = await request(server).post("/auth/login").send({ password: "admin" }).expect(400);
        expect(result.body, "Have Error Message").toHaveProperty("msg");
    });
    test("Login Path Wrong Password", async () => {
        await new UserService().create({ email: "admin_dummy@admin.com", password: "admin" });
        const result = await request(server).post("/auth/login").send({ email: "admin_dummy@admin.com", password: "admin1" }).expect(400);
        expect(result.body, "Have Error Message").toHaveProperty("msg");
        await prisma.user.deleteMany({ where: { email: "admin_dummy@admin.com" } });
    });
    test("Login Path Wrong Email", async () => {
        await new UserService().create({ email: "admin_dummy@admin.com", password: "admin" });
        const result = await request(server).post("/auth/login").send({ email: "admin_dummy1@admin.com", password: "admin" }).expect(400);
        expect(result.body, "Have Error Message").toHaveProperty("msg");
        await prisma.user.deleteMany({ where: { email: "admin_dummy@admin.com" } });
    });
    test("Register Path Success", async () => {
        const result = await request(server).post("/auth/register").send({ email: "admin_dummy@admin.com", password: "admin" }).expect(200);
        expect(result.body, "Success Have Token").toHaveProperty("user");
        await prisma.user.deleteMany({ where: { email: "admin_dummy@admin.com" } });
    });
    test("Register Path Malformed Email", async () => {
        const result = await request(server).post("/auth/register").send({ email: "admin_dummy", password: "admin" }).expect(400);
        expect(result.body, "Have Error Message").toHaveProperty("msg");
    });
    test("Register Path Missing One Property", async () => {
        const result = await request(server).post("/auth/register").send({ password: "admin" }).expect(400);
        expect(result.body, "Have Error Message").toHaveProperty("msg");
    });
    test("Register Path Email Already Exists", async () => {
        await new UserService().create({ email: "admin_dummy@admin.com", password: "admin" });
        const result = await request(server).post("/auth/register").send({ email: "admin_dummy@admin.com", password: "admin" }).expect(400);
        expect(result.body, "Have Error Message").toHaveProperty("msg");
        await prisma.user.deleteMany({ where: { email: "admin_dummy@admin.com" } });
    });
});
