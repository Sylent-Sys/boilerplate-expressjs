import express from "express"
import { router } from "express-file-routing"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors"
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors())
app.use(express.json())
app.use("/", await router({
    directory: path.join(__dirname, "routes"),
}))
export default app