import dotenv from "dotenv";
dotenv.config();



if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI environment variable");
}

if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Missing GOOGLE_CLIENT_ID environment variable");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("Missing ImageKit Private Key")
}



export const config = {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY
}