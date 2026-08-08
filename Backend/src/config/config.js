import dotenv from "dotenv";
dotenv.config();



if (!process.env.MONGO_URI) {
    console.error("Error: Missing MONGO_URI environment variable");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("Error: Missing JWT_SECRET environment variable");
    process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Error: Missing GOOGLE_CLIENT_SECRET environment variable");
    process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Error: Missing GOOGLE_CLIENT_ID environment variable");
    process.exit(1);
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
}