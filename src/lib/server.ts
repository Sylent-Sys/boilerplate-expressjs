import express from "express"
import { router } from "express-file-routing"
import path from "path"
import cors from "cors"
import "dotenv/config"
import { __dirname } from "@/lib/location.js"
import log from "@/middleware/log.js";
const app = express()
app.use(cors())
app.use(express.json())
app.use(log())
app.use("/", await router({
    directory: path.join(__dirname + "/../", "routes"),
}))
export default app