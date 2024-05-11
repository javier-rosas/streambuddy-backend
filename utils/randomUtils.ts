import { ALLOWED_ORIGINS } from "./constants";
import { execSync } from "child_process";

// Function to get the current commit hash
export function getCommitHash(): string {
  try {
    return execSync("git rev-parse HEAD").toString().trim();
  } catch (error) {
    console.error("Failed to get commit hash:", error);
    return "unknown";
  }
}

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
