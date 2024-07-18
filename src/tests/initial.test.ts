import { test, describe } from 'vitest';
import request from "supertest";
import server from "@/lib/server.js"
describe("Test the initial path", () => {
    test("/", async () => {
        return await request(server).get("/").expect(200);
    });
});
