import { User } from "../types";
import UserModel from "../mongoose/UserModel";

class UserDao {
  async getUserById(id: string) {
    return await UserModel.findById(id);
  }

  async createUser(userData: User) {
    const user = new UserModel(userData);
    return await user.save();
  }

  async updateUser(
    id: string,
    updateData: { username?: string; email?: string }
  ) {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id: string) {
    return await UserModel.findByIdAndDelete(id);
  }
}

export default new UserDao();
