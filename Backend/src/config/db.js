import mongoose from "mongoose";
import { config } from "./config.js";

function connectDB() {
    mongoose.connect(config.mongo_uri)
        .then(() => {
            console.log("Connected to Database");
        })
        .catch((err) => {
            console.error("Database connection error:", err);
        });
}

export default connectDB;
