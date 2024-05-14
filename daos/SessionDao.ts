import { Session } from "@/types/index";
import SessionModel from "@/mongoose/SessionModel";

class SessionDao {
  private static instance: SessionDao;

  // Private constructor to prevent instantiation
  private constructor() {}

  // Public method to get the singleton instance
  public static getInstance(): SessionDao {
    if (!SessionDao.instance) {
      SessionDao.instance = new SessionDao();
    }
    return SessionDao.instance;
  }

  // Method to find a session by user email
  async findSessionByEmail(userEmail: string): Promise<Session | null> {
    return await SessionModel.findOne({ userEmail });
  }

  // Method to create a new session
  async createSession(userEmail: string): Promise<Session> {
    const now = new Date();
    const expiration = new Date(now);
    expiration.setHours(now.getHours() + 1); // Set expiration to 1 hour from now

    const session = new SessionModel({
      creationTimestamp: now,
      expirationTimestamp: expiration,
      sessionStatus: "active",
      createdBy: userEmail,
      participant: null, // Initially, the participant is null
    });

    return await session.save();
  }
}

export default SessionDao.getInstance();
