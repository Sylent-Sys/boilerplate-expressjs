import app from "@/lib/server.js";
import "@/lib/validate.js"
app.listen(process.env.APP_PORT, () => {
  console.log("Server is running on port 3000");
});