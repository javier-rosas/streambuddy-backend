import { Router } from "express";
import { authenticateToken } from "@/middleware/authentication";
import userController from "@/controllers/UserController";

const router = Router();

// Public Route (No Authentication Middleware)
router.post("/users/authenticate", userController.authenticateUser);

// Middleware that applies to all subsequent routes
router.use(authenticateToken);

// User Routes
router.put("/users", userController.createOrUpdateUser);

export default router;
