import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../constants/Constant";
import { RECIPE_STATUS, Recipe } from "../models/RecipeModel";
import { User } from "../models/UserModel";
import chalk from "chalk";

// New Recipe - Creator
export const NewRecipe = async (req: Request, res: Response) => {
  try {
    const { title, description, preparation, ingredients, advanced, prepTime } = req.body;
    const newPreparation = JSON.parse(preparation);
    const newIngredients = JSON.parse(ingredients);
    const newAdvanced = JSON.parse(advanced);
    const recipe = new Recipe({ title, description, preparation: newPreparation, ingredients: newIngredients, advanced: newAdvanced, prepTime, creatorId: req.user?._id, img: req.file?.filename });
    await recipe.save();
    res.json({ status: true, message: "Recipe successfully submitted" });
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).json({ message: "Internal Error" });
  }
};

// All Creator Recipes
export const AllCreatorRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({ creatorId: req.user?._id });
    res.json({ status: true, message: "", recipes: recipes });
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).json({ message: "Internal Error" });
  }
};

// Recipe Single View for Creator
export const CreatorSingleRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, creatorId: req.user?._id });
    if (!recipe) return res.json({ message: "Recipe Not Found", status: false });
    res.json({ status: true, message: "Creator Single Recipe", recipe: recipe, });
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).json({ message: "Internal Error" });
  }
};

// All Recipes for Admin
export const AdminAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({ status: RECIPE_STATUS.PENDING });
    const alterRecipes = await recipes.map(async (recipes) => {
      const user = await User.findById(recipes.creatorId);
      return { recipes, creatorName: user?.name };
    });
    res.send(await Promise.all(alterRecipes));
  } catch (err) { }
};

// Update Recipe Status - Admin
export const AdminUpdateRecipeStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.params
    if (!id) return res.json({ message: "Invalid Recipe ID", status: false });

    const isRecipe = await Recipe.findById(id)
    if (!isRecipe) return res.json({ message: " Recipe not found", status: false });

    await Recipe.findByIdAndUpdate(id, { status })
    res.json({ message: " Recipe updated", status: true })
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false })
  }
}

// All Recipe - Admin
export const AllAdminRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find();
    const alterRecipes = await recipes.map(async (recipes) => {
      const user = await User.findById(recipes.creatorId);
      return { recipes, creatorName: user?.name };
    });

    res.send({ status: true, message: "All Recipes found", recipes: await Promise.all(alterRecipes) });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Fetch All recipe thar 
export const AllUserRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({
      status: RECIPE_STATUS.PUBLISHED,
    });
    const filterRecipe = recipes.filter((r) => r.advanced.visibility === true);
    res.json({ status: true, message: "", recipes: filterRecipe });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Search Recipe based on title, description, ingredients, preparation time
export const SearchRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({ $text: { $search: String(req.query.query) }, status: RECIPE_STATUS.PUBLISHED });
    res.json({ status: true, message: "Searched Recipes", recipes: recipes });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Single Recipe 
export const SingleRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const token = req.headers["auth-token"];

    if (!id) throw new Error("Invalid id");

    const recipe = await Recipe.findById(id);
    if (!recipe || recipe.status !== RECIPE_STATUS.PUBLISHED || !recipe.advanced.visibility) return res.json({ message: "Recipe not found", status: false });
    try {

      if (token) {
        const decoded = jwt.verify(token as string, secret);
        if (decoded) {
          // @ts-expect-error
          const userSaved = await User.findById(decoded._id);
          // @ts-expect-error
          if (!recipe.visitCount.includes(decoded._id)) await Recipe.findByIdAndUpdate(recipe._id, { $push: { visitCount: decoded._id }, });
          return res.json({ status: true, message: "Recipe Found", recipe, isSaved: userSaved?.savedRecipes.includes(id) });
        }
      }
    } catch (err) { console.log(chalk.red(err)) }
    res.json({ message: "Recipe Found", status: true, recipe });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Fetch User History 
export const UserHistory = async (req: Request, res: Response) => {
  try {
    const user = req?.user;
    if (!user) return res.json({ status: false, message: "Something went wrong " });

    const history = await Recipe.find({ visitCount: { $elemMatch: { $eq: user?._id } }, status: RECIPE_STATUS.PUBLISHED });
    res.json({ status: true, message: "", recipes: history });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Update Recipe Title
export const UpdateRecipeTitle = async (req: Request, res: Response) => {
  try {
    const { _id, title } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    await Recipe.findByIdAndUpdate(recipe._id, { title });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Update Recipe Image
export const UpdateRecipeImage = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    await Recipe.findByIdAndUpdate(recipe._id, { img: req.file?.filename });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Update Recipe Preparation Time string
export const UpdateRecipePrepTime = async (req: Request, res: Response) => {
  try {
    const { _id, prepTime } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    await Recipe.findByIdAndUpdate(recipe._id, { prepTime });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Update Recipe Description
export const UpdateRecipeDescription = async (req: Request, res: Response) => {
  try {
    const { _id, description } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    await Recipe.findByIdAndUpdate(recipe._id, { description });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Update Single Recipe Ingredient Item / Element
export const UpdateRecipeIngredientRow = async (req: Request, res: Response) => {
  try {
    const { _id, ingredient } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });

    const local = recipe.ingredients.map((ing) => ing?._id == ingredient?._id ? { ingredient: ingredient?.ingredient, _id: ingredient?._id } : ing);
    await Recipe.findByIdAndUpdate(recipe._id, { ingredients: local });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Delete Single Recipe Ingredient Item / Element
export const UpdateRecipeIngredientRowDelete = async (req: Request, res: Response) => {
  try {
    const { _id, ingredient } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    await Recipe.findByIdAndUpdate(recipe._id, { $pull: { ingredients: { _id: ingredient?._id } } });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Update Single Recipe Preparation Item / Element
export const UpdateRecipePreparationRow = async (req: Request, res: Response) => {
  try {
    const { _id, preparation } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    const local = recipe.preparation.map((ing) => ing?._id == preparation?._id ? { name: preparation?.name, _id: preparation?._id } : ing);
    await Recipe.findByIdAndUpdate(recipe._id, { preparation: local });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Delete Single Recipe Ingredient Item / Element
export const UpdateRecipePreparationRowDelete = async (req: Request, res: Response) => {
  try {
    const { _id, preparation } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    await Recipe.findByIdAndUpdate(recipe._id, { $pull: { preparation: { _id: preparation?._id } }, });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Update Recipe Advanced Options 
export const UpdateAdvanced = async (req: Request, res: Response) => {
  try {
    const { id, field } = req.params
    if (!id || !field) return res.json({ message: "Invalid Parameter", status: false })
    const recipe = await Recipe.findOne({ _id: id, creatorId: req?.user?._id });
    if (!recipe) return res.json({ message: "Recipe Not Found", status: false })
    // @ts-expect-error aaa
    recipe?.advanced[field] = !recipe.advanced[field]
    recipe?.save()
    // @ts-expect-error aaa
    res.json({ message: "Successfully Updated", status: true, [field]: recipe.advanced[field] });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
}

// Like Recipe
export const LikeRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const token = req.headers["auth-token"];
    if (!id) throw new Error("Invalid id");

    const recipe = await Recipe.findById(id);
    if (!recipe || recipe.status !== RECIPE_STATUS.PUBLISHED) return res.json({ message: "Recipe not found", status: false });

    if (token) {
      const decoded = jwt.verify(token as string, secret);
      if (decoded) {
        // @ts-expect-error
        if (recipe.likeRecipe.includes(decoded._id)) await Recipe.findByIdAndUpdate(recipe._id, { $pull: { likeRecipe: decoded._id } });
        // @ts-expect-error
        else await Recipe.findByIdAndUpdate(recipe._id, { $push: { likeRecipe: decoded._id } });
      }
    }
    res.json({ status: true, message: "Recipe Found", recipe: await Recipe.findById(recipe._id) });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Insert New Item to Ingredient
export const AddRecipeIngredientRow = async (req: Request, res: Response) => {
  try {
    const { _id, ingredient, index } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    await Recipe.findByIdAndUpdate(recipe._id, { $push: { ingredients: { $each: [{ ingredient }], $position: index } } });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Insert New Item to Preparation
export const AddRecipePreparationRow = async (req: Request, res: Response) => {
  try {
    const { _id, preparation, index } = req.body;
    const recipe = await Recipe.findOne({ creatorId: req?.user?._id, _id });
    if (!recipe) return res.json({ message: "Recipe not found", status: false });
    await Recipe.findByIdAndUpdate(recipe._id, { $push: { preparation: { $each: [{ name: preparation }], $position: index } } });
    res.json({ message: "Recipe Successfully Updated", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};

// Get All Liked Recipes - User
export const GetAllLikedRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({ likeRecipe: req?.user?._id });
    res.json({ message: "Recipe Successfully found", status: true, recipes });
  } catch (err: any) {
    console.log(err.message);
    res.json({ message: "Internal Error", err });
  }
};

// Delete Recipe - Creator
export const DeleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.json({ message: "Invalid id", status: false })
    await Recipe.findByIdAndDelete(id);
    res.json({ message: "Recipe Successfully Deleted", status: true });
  } catch (err) {
    console.log(chalk.red(err));
    res.json({ message: "Internal Error", status: false });
  }
};
