import { Router } from "express";
import { authenticateToken } from "@/middleware/authentication";
import sessionController from "@/controllers/SessionController";
import userController from "@/controllers/UserController";
const router = Router();

// Public Route (no authentication required to authenticate user)
router.post("/users/authenticate", userController.authenticateUser);
router.get("/join/:link", sessionController.findSessionByLink);

// Middleware that applies to all subsequent routes
router.use(authenticateToken);

// User Routes
router.put("/users", userController.createOrUpdateUser);

// Session Routes
router.post("/sessions", sessionController.createSession);
router.put("/sessions", sessionController.updateSession);

export default router;
