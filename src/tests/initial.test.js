import { test, describe } from 'vitest';
import request from "supertest";
import app from "../../dist/server.js";
describe("Test the initial path", () => {
    test("/", async () => {
        return await request(app).get("/").expect(200);
    });
});
