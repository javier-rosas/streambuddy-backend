import { User } from "@/types/index";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<User>(
  {
    email: { type: String, required: true },
    family_name: { type: String },
    given_name: { type: String },
    locale: { type: String },
    name: { type: String },
    nickname: { type: String },
    picture: { type: String },
    sid: { type: String },
    sub: { type: String },
    updated_at: { type: String },
  },
  { collection: "users", _id: false }
);

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
