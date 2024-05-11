import dotenv from "dotenv";
dotenv.config();

// Constants
export const PORT = process.env.PORT || 2000;

export const JWT_SECRET = process.env.JWT_SECRET;

export const NETFLIX_URL = process.env.NETFLIX_URL;
export const CHROME_EXTENSION_URL = process.env.CHROME_EXTENSION_URL;

export const ALLOWED_ORIGINS = [NETFLIX_URL, CHROME_EXTENSION_URL];
