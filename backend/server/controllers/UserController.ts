import { Request, Response } from "express";
import { Recipe } from "../models/RecipeModel";
import { USER_ROLE, User } from "./../models/UserModel";
import chalk from "chalk";

// New User
export const UserRegistration = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: { name: string, email: string, password: string } = req.body;
    const isUser = await User.findOne({ email });

    if (isUser) return res.json({ message: "User Already Registered", status: false });

    const user = new User({ name, email, password });
    await user.save();
    await user.incrementLoginCount();

    res.json({ status: true, message: "User Successfully Registered", });
  } catch (err) {
    console.log(chalk.red(err));;
    res.json({ status: false, message: "Internal Error" });
  }
};

// All Users for Admin
export const AllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json({ message: "All Users", status: true, users });
  } catch (err) {
    console.log(chalk.red(err));;
    res.json({ message: "Internal Error", status: false });
  }
};

// Authentication
export const UserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ message: "Invalid Credentials", status: false });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.json({ message: "Invalid Credentials", status: false });

    await user.incrementLoginCount();
    const token = await user.generateAuthToken();

    res.json({ status: true, message: "Successfully Logged In", user, token });
  } catch (err) {
    res.json({ message: "Internal Error", status: false });
  }
};

// Get Logged In User Information
export const UserProfile = async (req: Request, res: Response) => res.json({ status: true, user: req.user });;

// Push Recipe Id to User Document
export const SaveRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.json({ status: false, message: "Invalid Recipe Id" });

    const isRecipe = await Recipe.findById(id);
    if (!isRecipe) res.json({ status: false, message: "Recipe not found" });

    if (!req?.user) return res.json({ message: "User not found", status: false });

    const user = await User.findById(req?.user?._id);
    if (user?.savedRecipes?.includes(id)) await User.findByIdAndUpdate(user?._id, { $pull: { savedRecipes: { $in: [id] } } });
    else await User.findByIdAndUpdate(user?._id, { $push: { savedRecipes: id } });

    const afterCheck = await User.findById(user?._id);
    return res.json({ message: afterCheck?.savedRecipes.includes(id) ? "Recipe not saved" : "Recipe not saved", status: true, saved: afterCheck?.savedRecipes.includes(id), });
  } catch (err) {
    console.log(chalk.red(err));;
    res.json({ status: false, message: "Internal Error" });
  }
};

// Get All Saved Recipes
export const GetSavedRecipes = async (req: Request, res: Response) => {
  try {
    const user = req?.user;
    if (!user) return res.json({ message: "User not found", status: false });

    const savedRecipes = user?.savedRecipes.map(async (recipe) => await Recipe.findById(recipe));
    res.json({ message: "Recipes found", status: true, recipes: await Promise.all(savedRecipes), });
  } catch (err) {
    console.log(chalk.red(err));;
    res.json({ status: false, message: "Internal Error" });
  }
};

// Update Logged In User Name
export const UpdateName = async (req: Request, res: Response) => {
  try {
    const { name }: { name: string } = req.body;
    const user = req?.user;

    if (!user || !name) return res.json({ message: "Invalid Parameters", status: false });

    const isUser = await User.findByIdAndUpdate(user?._id, { name });
    res.json({ status: true, message: "Name updated", user: isUser });
  } catch (err) {
    console.log(chalk.red(err));;
    res.json({ status: false, message: "Internal Error" });
  }
};

// Update Logged In User Profile Image
export const UpdateImage = async (req: Request, res: Response) => {
  try {
    const _id: string = req.body._id;
    if (!_id) return res.json({ message: "Invalid Parameters", status: false });

    const isUser = await User.findByIdAndUpdate(_id, { profileImg: req.file?.filename, });
    res.json({ status: true, message: "Profile updated", user: isUser, profileImg: req.file?.filename, });
  } catch (err) {
    console.log(chalk.red(err));;
    res.status(500).json({ status: false, message: "Internal Error" });
  }
};

// Update User Role - Admin 
export const UpdateUserRole = async (req: Request, res: Response) => {
  try {
    const { role, _id }: { role: USER_ROLE; _id: string } = req.body;
    const user = req?.user;

    if (user?.role !== USER_ROLE.ADMIN) return res.json({ message: "User not found", status: false });

    const isUser = await User.findById(_id);
    if (!isUser) return res.json({ message: "User not found", status: false });

    await User.findByIdAndUpdate(_id, { role });
    res.json({ message: "User role updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));;
    res.json({ status: false, message: "Internal Error" });
  }
};
