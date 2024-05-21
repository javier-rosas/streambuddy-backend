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

  // Method to find a session by link
  async findSessionByLink(link: string): Promise<Session | null> {
    return await SessionModel.findOne({ link });
  }

  // Method to create a new session
  async createSession(userEmail: string): Promise<Session> {
    const now = new Date();
    const expiration = new Date(now);
    expiration.setHours(now.getHours() + 12); // Set expiration to 12 hours from now

    const link = generateRandomString(5);
    const session = new SessionModel({
      creationTimestamp: now,
      expirationTimestamp: expiration,
      createdBy: userEmail,
      participant: null, // Initially, the participant is null
      sessionStatus: "inactive",
      link,
      platform: "netflix", // TODO: Get platform from user input
    });

    const res = await session.save();
    return res;
  }

  // Method to update an existing session
  async updateSession(
    link: string,
    participant: string
  ): Promise<Session | null> {
    const session = await SessionModel.findOneAndUpdate(
      { link },
      {
        $set: {
          participant,
          sessionStatus: "active",
        },
      },
      {
        new: true,
      }
    );
    return session;
  }
}

export default SessionDao.getInstance();
