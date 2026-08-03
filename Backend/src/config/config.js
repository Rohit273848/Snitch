import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
    console.error("Error: Missing MONGO_URI environment variable");
    process.exit(1);
}

export const config = {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT
}