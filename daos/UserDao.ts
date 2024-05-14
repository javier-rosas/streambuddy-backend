// import { User } from "@/types/index";
// import UserModel from "@/mongoose/UserModel";

// class UserDao {
//   async createOrUpdateUser(user: User) {
//     try {
//       const filter = { email: user.email };
//       const update = user;
//       const options = { new: true, upsert: true, setDefaultsOnInsert: true };
//       const newUser = await UserModel.findOneAndUpdate(filter, update, options);
//       return newUser;
//     } catch (err) {
//       throw new Error("Error creating or updating user");
//     }
//   }
// }

// export default new UserDao();

import { User } from "@/types/index";
import UserModel from "@/mongoose/UserModel";

class UserDao {
  private static instance: UserDao;

  // Private constructor to prevent instantiation
  private constructor() {}

  // Public method to get the singleton instance
  public static getInstance(): UserDao {
    if (!UserDao.instance) {
      UserDao.instance = new UserDao();
    }
    return UserDao.instance;
  }

  // Method to check if user exists by email
  async findUserByEmail(userEmail: string) {
    return await UserModel.findOne({ email: userEmail });
  }

  async createOrUpdateUser(user: User) {
    try {
      const filter = { email: user.email };
      const update = user;
      const options = { new: true, upsert: true, setDefaultsOnInsert: true };
      const newUser = await UserModel.findOneAndUpdate(filter, update, options);
      return newUser;
    } catch (err) {
      throw new Error("Error creating or updating user");
    }
  }
}

// Export the singleton instance
export default UserDao.getInstance();
