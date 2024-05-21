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

  // Method to handle createSession request
  async createSession(req: Request, res: Response): Promise<void> {
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

  // Method to get the session by link
  async findSessionByLink(req: Request, res: Response): Promise<void> {
    const link: string = req.params.link;

    if (!link) {
      res.status(400).json({ error: "Link is required" });
      return;
    }

    try {
      const session = await sessionDao.findSessionByLink(link);

      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      res.status(200).json(session);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  // Method to handle joinSession request
  async updateSession(req: Request, res: Response): Promise<void> {
    const link: string = req.body.link;
    const userEmail: string = req.body.userEmail;

    if (!userEmail || !link) {
      res.status(400).json({
        error: "User email and link are required to join the session.",
      });
      return;
    }

    try {
      // Check if the user exists
      const user = await userDao.findUserByEmail(userEmail);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Attempt to retrieve the session using the link
      let session = await sessionDao.findSessionByLink(link);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      // Check if the session is already active or expired
      if (session.sessionStatus !== "inactive") {
        res.status(400).json({
          error: "Session is either already active or expired.",
        });
        return;
      }

      session = await sessionDao.updateSession(link, user.email);

      res
        .status(200)
        .json({ message: "User joined the session successfully", session });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }
}

// Export the singleton instance
export default SessionController.getInstance();
