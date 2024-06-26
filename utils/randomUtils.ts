import { ALLOWED_ORIGINS } from "@/utils/constants";

// CORS Middleware to handle multiple allowed origins
export const corsOptionsDelegate = function (req: any, callback: any) {
  var corsOptions;
  if (ALLOWED_ORIGINS.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // Reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // Disable CORS for this request
  }
  callback(null, corsOptions); // Callback expects two parameters: error and options
};

// Function to generate a random string of a given length
export const generateRandomString = (length: number): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
