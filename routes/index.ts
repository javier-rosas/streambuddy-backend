import { MONGO_USERNAME } from "@/utils/constants";
import { Router } from "express";
import { authenticateToken } from "@/middleware/authentication";
import sessionController from "@/controllers/SessionController";
import userController from "@/controllers/UserController";

const router = Router();

// Routes
router.get("/", (req: any, res: any) => {
  res.send(`Hello World! ${MONGO_USERNAME}`);
});

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
