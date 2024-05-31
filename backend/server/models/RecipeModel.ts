import { Schema, model } from "mongoose";

interface IIngredients { name: string; _id: string }
interface IStep { name: string; _id: string; }
export enum RECIPE_STATUS { PUBLISHED = "published", UNPUBLISHED = "unpublished", PENDING = "pending", removed = "removed" }

interface IRecipe {
  title: string;
  description: string;
  ingredients: IIngredients[];
  preparation: IStep[];
  prepTime: string;
  category: string[];
  advanced: {
    visibility: boolean;
    saveRecipe: boolean;
    likeRecipe: boolean;
    commentRecipe: boolean;
  };
  visitCount: string[];
  likeRecipe: string[];
  creatorId: string;
  status: RECIPE_STATUS;
  img: string;
  commentId: string;
}

interface IRecipeMethods { }

const recipeSchema = new Schema<IRecipe, {}, IRecipeMethods>({
  title: { type: String, required: true, },
  description: { type: String, required: true, },
  ingredients: { type: [{ ingredient: String }], required: true, },
  preparation: { type: [{ name: String }], required: true, },
  advanced: { type: { visibility: Boolean, saveRecipe: Boolean, likeRecipe: Boolean, commentRecipe: Boolean, }, required: true, },
  creatorId: { type: String, required: true, },
  status: { type: String, enum: RECIPE_STATUS, default: RECIPE_STATUS.PENDING },
  img: { type: String, required: true },
  prepTime: { type: String, },
  visitCount: { type: ["String"], default: [], },
  likeRecipe: { type: ["String"], default: [], },
  commentId: { type: String },
}, { timestamps: true });

export const Recipe = model<IRecipe>("recipes", recipeSchema);
