import { Router } from "express";
import multer from "multer";
import path from "path";
import { AllUserRecipes, SearchRecipes, SingleRecipe, UserHistory, AllAdminRecipes, AdminAllRecipes, AdminUpdateRecipeStatus, CreatorSingleRecipe, NewRecipe, UpdateRecipeTitle, UpdateRecipeDescription, UpdateRecipeIngredientRow, UpdateRecipeIngredientRowDelete, UpdateAdvanced } from "../controllers/RecipeController";
import { AdminMiddleware, VerifyCreatorToken, VerifyToken } from "../middlewares/VerifyToken";
import { AddRecipeIngredientRow, AddRecipePreparationRow, AllCreatorRecipes, DeleteRecipe, GetAllLikedRecipes, LikeRecipe, UpdateRecipeImage, UpdateRecipePrepTime, UpdateRecipePreparationRow, UpdateRecipePreparationRowDelete } from './../controllers/RecipeController';

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(path.resolve(), "uploads", "recipes")); },
  filename: function (req, file, cb) { const unique = Date.now() + "-" + Math.round(Math.random() * 1e9); cb(null, unique + "-" + file.originalname); },
});
const upload = multer({ storage });

const route = Router();

// User || Guest
route.get("/user/all", AllUserRecipes);
route.get("/user/search", SearchRecipes);
route.post("/user/advanced/likeRecipe/:id", LikeRecipe);
route.get("/:id", SingleRecipe);
route.get("/user/history", VerifyToken, UserHistory);
route.get("/user/liked", VerifyToken, GetAllLikedRecipes);

// Admin
route.get("/admin/all", AdminMiddleware, AllAdminRecipes);
route.get("/admin/allPending", AdminMiddleware, AdminAllRecipes);
route.put("/admin/update/recipe/:id/:status", AdminMiddleware, AdminUpdateRecipeStatus);

// Creator
route.get("/creator/all", VerifyCreatorToken, AllCreatorRecipes);
route.get("/creator/view/:id", VerifyCreatorToken, CreatorSingleRecipe);
route.post("/creator/insert", upload.single("img"), VerifyCreatorToken, NewRecipe);
route.put("/creator/edit/title", VerifyCreatorToken, UpdateRecipeTitle);
route.put("/creator/edit/img", VerifyCreatorToken, upload.single("img"), UpdateRecipeImage);
route.put("/creator/edit/prepTime", VerifyCreatorToken, UpdateRecipePrepTime);
route.put("/creator/edit/description", VerifyCreatorToken, UpdateRecipeDescription);
route.put("/creator/edit/ingredient/row/insert", VerifyCreatorToken, AddRecipeIngredientRow);
route.put("/creator/edit/preparation/row/insert", VerifyCreatorToken, AddRecipePreparationRow);
route.put("/creator/edit/ingredient/row", VerifyCreatorToken, UpdateRecipeIngredientRow);
route.put("/creator/edit/ingredient/row/delete", VerifyCreatorToken, UpdateRecipeIngredientRowDelete);
route.put("/creator/edit/preparation/row", VerifyCreatorToken, UpdateRecipePreparationRow);
route.put("/creator/edit/preparation/row/delete", VerifyCreatorToken, UpdateRecipePreparationRowDelete);
route.put("/creator/edit/advanced/:id/:field", VerifyCreatorToken, UpdateAdvanced)
route.delete("/creator/delete/recipe/:id", VerifyCreatorToken, DeleteRecipe);

export { route as RecipeRoute }