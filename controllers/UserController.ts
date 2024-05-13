import { Request, Response } from "express";

import { JWT_SECRET } from "@/utils/constants";
import jwt from "jsonwebtoken";
import userDao from "@/daos/UserDao";

class UserController {
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userDao.getUserById(req.params.id);
      res.json(user);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const newUser = await userDao.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await userDao.updateUser(req.params.id, req.body);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await userDao.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  async authenticateUser(req: Request, res: Response) {
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

export default new UserController();
