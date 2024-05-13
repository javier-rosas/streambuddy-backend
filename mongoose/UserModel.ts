import { User } from "@/types/index";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
