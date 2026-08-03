import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connect from "./src/config/db.js";
import { config } from "./src/config/config.js";

connect();

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});