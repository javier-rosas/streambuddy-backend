import { Request, Response } from "express";

import sessionDao from "@/daos/SessionDao"; // Import the SessionDao
import userDao from "@/daos/UserDao";

class SessionController {
  private static instance: SessionController;

  // Public method to get the singleton instance
  public static getInstance(): SessionController {
    if (!SessionController.instance) {
      SessionController.instance = new SessionController();
    }
    return SessionController.instance;
  }

  // Method to handle postSession request
  async postSession(req: Request, res: Response): Promise<void> {
    const userEmail: string = req.body.userEmail;

    if (!userEmail) {
      res.status(400).json({ error: "User email is required" });
      return;
    }

    try {
      // Check if the user exists
      const user = await userDao.findUserByEmail(userEmail);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Check if there is an existing session for the user
      let session = await sessionDao.findSessionByEmail(userEmail);

      // If no session exists, create a new one
      if (!session) {
        session = await sessionDao.createSession(userEmail);
      }

      res.status(200).json(session);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

// Export the singleton instance
export default SessionController.getInstance();
