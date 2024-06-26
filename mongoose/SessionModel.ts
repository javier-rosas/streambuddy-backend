import { Session } from "@/types/index";
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema<Session>(
  {
    creationTimestamp: { type: Date, required: true },
    expirationTimestamp: { type: Date, required: true },
    createdBy: { type: String, ref: "User", required: true },
    participant: { type: String, ref: "User", default: null },
    sessionStatus: {
      type: String,
      enum: ["active", "inactive", "expired"],
      required: true,
    },
    sessionCode: { type: String, required: true },
    platformUrl: { type: String, required: false },
  },
  { collection: "sessions" }
);

const SessionModel = mongoose.model<Session>("Session", sessionSchema);
export default SessionModel;
