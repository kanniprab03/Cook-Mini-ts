import { Request, Response } from "express";
import { Recipe } from "../models/RecipeModel";
import { Comment } from "../models/CommentsModel";
import { IUser, User } from "../models/UserModel";
import chalk from "chalk";

// New Comment
export const NewComment = async (req: Request, res: Response) => {
  try {
    const { comment }: { comment: string } = req.body;
    const user = req?.user;
    if (!user) return res.json({ status: false, message: "You are not authorized to perform this action" });
    if (!comment) return res.json({ message: "Comment is required", status: false });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.json({ message: "Recipe not found", status: false });

    const isComment = await Comment.findById(recipe?.commentId);
    if (!isComment) {
      const newComment = new Comment({ comments: [{ comment, userId: user?._id }], userId: user?._id });
      await newComment.save();
      await Recipe.findByIdAndUpdate(recipe._id, { commentId: newComment._id });

      const oldComment = await Comment.findById(newComment._id);
      const arr = oldComment?.comments?.map(async (comment) => {
        const user = await User.findById(comment.userId);
        return { ...comment, userName: user?.name, };
      });
      return res.json({ message: "Comment created", status: true, comments: await Promise.all(arr!) });
    } else {
      await Comment.findByIdAndUpdate(recipe.commentId, { $push: { comments: { comment, userId: user?._id } } });

      const oldComment = await Comment.findById(isComment._id);
      const arr2 = oldComment?.comments?.map(async (comment) => {
        const user = await User.findById(comment.userId);
        return { ...comment, userName: user?.name, profileImg: user?.profileImg, };
      });

      return res.json({ message: "Comment created", status: true, comments: await Promise.all(arr2!) });
    }
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).json({ message: "Internal Error" });
  }
};

// Fetch Comment By Id
export const GetComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || id === undefined) return res.json({ status: false, message: "Something went wrong" });

    const isComment = await Comment.findById(id);
    if (!isComment) return res.json({ status: false, message: "Comment not found" });

    const arr = isComment?.comments?.map(async (comment) => {
      const user = await User.findById(comment.userId);
      const obj = {
        ...comment,
        userName: user?.name,
        profileImg: user?.profileImg,
      };
      return obj;
    });

    res.json({ status: true, comments: await Promise.all(arr), message: "Comment Found" });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};
