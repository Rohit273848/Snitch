import dotenv from "dotenv";
import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connect from "./src/config/db.js";
dotenv.config();

connect();

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});