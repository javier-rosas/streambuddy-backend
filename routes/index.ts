import { Request, Response, Router } from "express";

import { MONGO_USERNAME } from "@/utils/constants";
import { authenticateToken } from "@/middleware/authentication";
import sessionController from "@/controllers/SessionController";
import userController from "@/controllers/UserController";

const router = Router();

// Routes
router.get("/", (req: Request, res: Response) => {
  res.send(`Hello World! ${MONGO_USERNAME}`);
});

// Public Route (no authentication required to authenticate user)
router.post("/users/authenticate", userController.authenticateUser);

// Middleware that applies to all subsequent routes
router.use(authenticateToken);

// User Routes
router.put("/users", userController.createOrUpdateUser);

// Session Routes
router.post("/sessions", sessionController.createSession);
router.put("/sessions", sessionController.updateSession);
router.get(
  "/sessions/:sessionCode",
  sessionController.findSessionBySessionCode
);

export default router;
