import { Handler } from "express";

export const get: Handler = (_req, res) => {
    return res.json({ msg: "Template Express By Sylent-Sys" });
};