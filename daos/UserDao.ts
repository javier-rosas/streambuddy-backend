import { User } from "@/types/index";
import UserModel from "@/mongoose/UserModel";

class UserDao {
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

export default new UserDao();
