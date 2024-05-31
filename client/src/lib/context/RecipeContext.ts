import { createContext, useContext } from "react";

export enum RECIPE_STATUS { PUBLISHED = "published", UNPUBLISHED = "unpublished", PENDING = "pending", removed = "removed", }

export interface IIngredient { ingredient: string; _id: string; }
export interface IPreparation { name: string; _id: string; }
export interface IAdvanced { visibility: boolean; saveRecipe: boolean; likeRecipe: boolean; commentRecipe: boolean; }
export interface IGlobalRecipe { commentId: string; title: string; description: string; ingredients: IIngredient[]; preparation: IPreparation[]; advanced?: IAdvanced; creatorId?: string; status?: RECIPE_STATUS; img: string; visitCount?: string[]; _id?: string; prepTime?: string; likeRecipe: string[] }
export interface IAdminGlobalRecipe { recipes: IGlobalRecipe; creatorName: string; }
export interface IInsertRecipeResponse { message: string; status: boolean; }
export interface IGetAllRecipeResponse extends IInsertRecipeResponse { recipes: IGlobalRecipe[]; }
export interface IGetADminRecipeResponse extends IInsertRecipeResponse { recipes: IGlobalRecipe[]; creatorName: string; }
export interface IGetSingleRecipeResponse extends IInsertRecipeResponse { recipe: IGlobalRecipe | undefined; isSaved: boolean; }
export interface IUpdateTitle { _id: string; title: string; }
export interface IUpdatePrepTIme { _id: string; prepTime: string; }
export interface IUpdateDescription { _id: string; description: string; }
export interface IUpdateIngredientsRow { _id: string; ingredient: IIngredient; }
export interface IUpdateIngredientsRowDelete { _id: string; ingredient: { _id: string } }
export interface IUpdatePreparationRow { _id: string; preparation: IPreparation; }
export interface IUpdatePreparationRowDelete { _id: string; preparation: { _id: string } }
export interface IUpdateAdvancedSaveRecipe { _id: string, save: boolean }
export interface IUpdateAdvancedSaveRecipeResponse extends IInsertRecipeResponse { save: boolean }
export interface IUpdateAdvancedCommentRecipe { _id: string, comment: boolean }
export interface IUpdateAdvancedCommentRecipe { _id: string, comment: boolean }
export interface IUpdateAdvancedCommentRecipeResponse extends IInsertRecipeResponse { comment: boolean }
export interface IUpdateAdvancedLikeRecipe { _id: string, like: boolean }
export interface IUpdateAdvancedVisibilityRecipe { _id: string, visibility: boolean }
export interface IUpdateAdvancedLikeRecipeResponse extends IInsertRecipeResponse { like: boolean }
export interface IUpdateAdvancedVisibilityRecipeResponse extends IInsertRecipeResponse { visibility: boolean }
export interface ILikeRecipeResponse extends IGetSingleRecipeResponse { }
export interface ISavedResponse extends IInsertRecipeResponse { saved: boolean }
export interface IAddIngredientRow { _id: string; index: number, ingredient: string }
export interface IAddPreparationRow { _id: string; index: number, preparation: string }

export interface IRecipeContext {
  globalRecipe: IGlobalRecipe[];
  singleRecipe: IGlobalRecipe;
  adminRecipes: IAdminGlobalRecipe[];
  insertRecipe: (payload: FormData) => Promise<IInsertRecipeResponse>;
  getAllRecipes: () => Promise<IGetAllRecipeResponse>;
  getRecipe: (id: string) => Promise<IGetSingleRecipeResponse>;
  getSearchRecipe: (query: string) => Promise<IGetAllRecipeResponse>;
  getCreatorAllRecipes: () => Promise<IGetAllRecipeResponse>;
  getAdminAllRecipes: () => Promise<IGetADminRecipeResponse>;
  updateRecipeStatus: (id: string, status: RECIPE_STATUS) => Promise<IInsertRecipeResponse>;
  getCreatorRecipe: (id: string) => Promise<IGetSingleRecipeResponse>;
  updateTitle: (payload: IUpdateTitle) => Promise<IInsertRecipeResponse>;
  updateImage: (payload: FormData) => Promise<IInsertRecipeResponse>;
  updatePrepTime: (payload: IUpdatePrepTIme) => Promise<IInsertRecipeResponse>;
  updateDescription: (payload: IUpdateDescription) => Promise<IInsertRecipeResponse>;
  updateIngredientRow: (payload: IUpdateIngredientsRow) => Promise<IInsertRecipeResponse>;
  updateIngredientRowDelete: (payload: IUpdateIngredientsRowDelete) => Promise<IInsertRecipeResponse>;
  updatePreparationRow: (payload: IUpdatePreparationRow) => Promise<IInsertRecipeResponse>;
  updatePreparationRowDelete: (payload: IUpdatePreparationRowDelete) => Promise<IInsertRecipeResponse>;
  updateAdvancedSaveRecipe: (payload: IUpdateAdvancedSaveRecipe) => Promise<IUpdateAdvancedSaveRecipeResponse>
  updateAdvancedCommentRecipe: (payload: IUpdateAdvancedCommentRecipe) => Promise<IUpdateAdvancedCommentRecipeResponse>
  updateAdvancedLikeRecipe: (payload: IUpdateAdvancedLikeRecipe) => Promise<IUpdateAdvancedLikeRecipeResponse>
  updateAdvancedVisibilityRecipe: (payload: IUpdateAdvancedVisibilityRecipe) => Promise<IUpdateAdvancedVisibilityRecipeResponse>
  likeRecipe: (id: string) => Promise<ILikeRecipeResponse>
  saveRecipe: (id: string) => Promise<ISavedResponse>
  addIngredientRow: (payload: IAddIngredientRow) => Promise<IInsertRecipeResponse>
  addPreparationRow: (payload: IAddPreparationRow) => Promise<IInsertRecipeResponse>
  getUserLikedRecipe: () => Promise<IGetAllRecipeResponse>
  getUserSavedRecipe: () => Promise<IGetAllRecipeResponse>
  getUserHistory: () => Promise<IGetAllRecipeResponse>
  deleteRecipe: (id: string) => Promise<IInsertRecipeResponse>
}

export const RecipeContext = createContext<IRecipeContext | undefined>(undefined);
export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error("RecipeContext must be used inside a RecipeContext instance");
  return context;
};
