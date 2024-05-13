import dotenv from "dotenv";
dotenv.config();

// Constants
export const PORT = process.env.PORT || 2000;

export const JWT_SECRET = process.env.JWT_SECRET;

export const NETFLIX_URL = process.env.NETFLIX_URL;
export const CHROME_EXTENSION_URL = process.env.CHROME_EXTENSION_URL;

export const ALLOWED_ORIGINS = [NETFLIX_URL, CHROME_EXTENSION_URL];

export const MONGO_USERNAME = process.env.MONGO_USERNAME;
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
export const MONGO_HOST = process.env.MONGO_HOST;
export const MONGO_DATABASE = process.env.MONGO_DATABASE;
