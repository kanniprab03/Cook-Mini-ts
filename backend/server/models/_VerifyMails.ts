import { Schema, model } from "mongoose";
import { USER_ROLE } from "./UserModel";

interface IVerify {
  email: string;
  role: USER_ROLE;
  token: string;
}

const verifySchema = new Schema<IVerify, {}, {}>({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: USER_ROLE,
    required: true,
    default: USER_ROLE.USER,
  },
  token: {
    type: String,
    required: true,
  },
});

export const Verify = model<IVerify>("verifyUser", verifySchema);
