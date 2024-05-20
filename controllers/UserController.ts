import { Request, Response } from "express";

import { JWT_SECRET } from "@/utils/constants";
import jwt from "jsonwebtoken";
import userDao from "@/daos/UserDao";

class UserController {
  private static instance: UserController;

  // Private constructor to prevent instantiation
  private constructor() {}

  // Public method to get the singleton instance
  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  async createOrUpdateUser(req: Request, res: Response): Promise<any> {
    try {
      const user = req.body.user;

      if (!user) {
        return res.status(400).json({ error: "User data is required" });
      }
      const newUser = await userDao.createOrUpdateUser(user);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async authenticateUser(req: Request, res: Response): Promise<any> {
    try {
      const user = req.body;
      if (!user) {
        return res.status(400).json({ error: "User data is required" });
      }

      if (!JWT_SECRET) {
        throw new Error(
          "JWT_SECRET is undefined. Please set it in your environment."
        );
      }

      // Ideally, you should validate the user data against your database here
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.json({ jwt: token });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

// Export the singleton instance
export default UserController.getInstance();
