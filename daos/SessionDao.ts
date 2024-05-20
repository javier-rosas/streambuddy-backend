import { Session } from "@/types/index";
import SessionModel from "@/mongoose/SessionModel";
import { generateRandomString } from "@/utils/randomUtils";
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
    return await SessionModel.findOne({ createdBy: userEmail });
  }

  // Method to create a new session
  async createSession(userEmail: string): Promise<Session> {
    const now = new Date();
    const expiration = new Date(now);
    expiration.setHours(now.getHours() + 12); // Set expiration to 12 hours from now

    const link = generateRandomString(8);
    const session = new SessionModel({
      creationTimestamp: now,
      expirationTimestamp: expiration,
      createdBy: userEmail,
      participant: null, // Initially, the participant is null
      sessionStatus: "active",
      link,
    });

    const res = await session.save();
    return res;
  }
}

export default SessionDao.getInstance();
