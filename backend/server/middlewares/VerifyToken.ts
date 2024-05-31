import { NextFunction, Request, Response } from "express";
import { USER_ROLE, User } from "../models/UserModel";
import jwt from "jsonwebtoken";
import { secret } from "../constants/Constant";
import chalk from "chalk";

export const VerifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["auth-token"];
    // @ts-expect-error aaa
    let user = await User.findByToken(token);
    if (!user) throw new Error("Unauthorized");
    req.user = user;
    next();
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Unauthorized", status: false });
  }
};

export const VerifyCreatorToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["auth-token"];
    // @ts-expect-error aaa
    let user = await User.findByToken(token);
    if (!user || user?.role !== USER_ROLE.CREATOR) throw new Error("Unauthorized");
    req.user = user;
    next();
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Unauthorized", status: false });
  }
};

export const AdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["auth-token"];
    // @ts-expect-error aaa
    const decode = jwt.verify(token, secret);
    const admin = await User.findOne({ _id: decode._id });
    if (!admin || admin.role !== USER_ROLE.ADMIN) res.status(404).json({ message: "Unauthorized", status: false });
    // @ts-expect-error aaa
    req.user = admin;
    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.status(500).json({ message: "Server Error", status: false });
  }
};