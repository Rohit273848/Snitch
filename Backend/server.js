import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connect from "./src/config/db.js";

connect();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});