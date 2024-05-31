import { Schema, model } from "mongoose";

export interface ICommentArr { comment: string; userId: string; isHelpful?: { _id: string; helpful: boolean; }[] }
export interface IComment { comments: ICommentArr[] }
export interface ICommentMethod { }

const commentSchema = new Schema<IComment, {}, ICommentMethod>(
  { comments: { type: [], default: [] } },
  { timestamps: true, }
);

export const Comment = model("comments", commentSchema);
