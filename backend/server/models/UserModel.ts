import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HydratedDocument, Model, Schema, model } from "mongoose";
import { secret } from "../constants/Constant";

export enum USER_ROLE { ADMIN = "admin", USER = "user", CREATOR = "creator", GUEST = "guest" }
export interface IUser { _id: string; name: string; email: string; password: string; role: USER_ROLE; loginCount: number; profileImg?: string; savedRecipes: string[]; }
export interface IUserMethods {
  comparePassword: (password: string) => Promise<boolean>;
  incrementLoginCount: () => Promise<void>;
  generateAuthToken: () => Promise<string>;
}
export interface IUserModel extends Model<IUser, {}, IUserMethods> { findByToken: (token: string) => Promise<HydratedDocument<IUser, IUserMethods>> }

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: { type: String, required: true, },
    email: { type: String, required: true, },
    password: { type: String, required: true, },
    role: { type: String, enum: USER_ROLE, required: true, default: USER_ROLE.USER },
    loginCount: { type: Number, default: 1 },
    profileImg: { type: String, },
    savedRecipes: { type: ["String"], default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

userSchema.method("comparePassword", async function (password: string) {
  return await bcrypt.compare(password, this.password);
});

export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.method("incrementLoginCount", async function () {
  this.loginCount++;
  return await this.save();
});

userSchema.method("generateAuthToken", async function () {
  const token: string = jwt.sign({ _id: this._id }, secret, {
    expiresIn: "1d",
  });
  return token;
});

userSchema.static("findByToken", async function (token: string) {
  try {
    const decoded = jwt.verify(token, secret);
    // @ts-ignore
    const user = await this.findOne({ _id: decoded._id });
    return user;
  } catch (err) {
    throw new Error("Error verifying token: " + err);
  }
});

export const User = model<IUser, IUserModel>("users", userSchema);
