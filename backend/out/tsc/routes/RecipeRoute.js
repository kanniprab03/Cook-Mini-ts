"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeRoute = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const RecipeController_1 = require("../controllers/RecipeController");
const VerifyToken_1 = require("../middlewares/VerifyToken");
const RecipeController_2 = require("./../controllers/RecipeController");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) { cb(null, path_1.default.join(path_1.default.resolve(), "uploads", "recipes")); },
    filename: function (req, file, cb) { const unique = Date.now() + "-" + Math.round(Math.random() * 1e9); cb(null, unique + "-" + file.originalname); },
});
const upload = (0, multer_1.default)({ storage });
const route = (0, express_1.Router)();
exports.RecipeRoute = route;
// User || Guest
route.get("/user/all", RecipeController_1.AllUserRecipes);
route.get("/user/search", RecipeController_1.SearchRecipes);
route.post("/user/advanced/likeRecipe/:id", RecipeController_2.LikeRecipe);
route.get("/:id", RecipeController_1.SingleRecipe);
route.get("/user/history", VerifyToken_1.VerifyToken, RecipeController_1.UserHistory);
route.get("/user/liked", VerifyToken_1.VerifyToken, RecipeController_2.GetAllLikedRecipes);
// Admin
route.get("/admin/all", VerifyToken_1.AdminMiddleware, RecipeController_1.AllAdminRecipes);
route.get("/admin/allPending", VerifyToken_1.AdminMiddleware, RecipeController_1.AdminAllRecipes);
route.put("/admin/update/recipe/:id/:status", VerifyToken_1.AdminMiddleware, RecipeController_1.AdminUpdateRecipeStatus);
// Creator
route.get("/creator/all", VerifyToken_1.VerifyCreatorToken, RecipeController_2.AllCreatorRecipes);
route.get("/creator/view/:id", VerifyToken_1.VerifyCreatorToken, RecipeController_1.CreatorSingleRecipe);
route.post("/creator/insert", upload.single("img"), VerifyToken_1.VerifyCreatorToken, RecipeController_1.NewRecipe);
route.put("/creator/edit/title", VerifyToken_1.VerifyCreatorToken, RecipeController_1.UpdateRecipeTitle);
route.put("/creator/edit/img", VerifyToken_1.VerifyCreatorToken, upload.single("img"), RecipeController_2.UpdateRecipeImage);
route.put("/creator/edit/prepTime", VerifyToken_1.VerifyCreatorToken, RecipeController_2.UpdateRecipePrepTime);
route.put("/creator/edit/description", VerifyToken_1.VerifyCreatorToken, RecipeController_1.UpdateRecipeDescription);
route.put("/creator/edit/ingredient/row/insert", VerifyToken_1.VerifyCreatorToken, RecipeController_2.AddRecipeIngredientRow);
route.put("/creator/edit/preparation/row/insert", VerifyToken_1.VerifyCreatorToken, RecipeController_2.AddRecipePreparationRow);
route.put("/creator/edit/ingredient/row", VerifyToken_1.VerifyCreatorToken, RecipeController_1.UpdateRecipeIngredientRow);
route.put("/creator/edit/ingredient/row/delete", VerifyToken_1.VerifyCreatorToken, RecipeController_1.UpdateRecipeIngredientRowDelete);
route.put("/creator/edit/preparation/row", VerifyToken_1.VerifyCreatorToken, RecipeController_2.UpdateRecipePreparationRow);
route.put("/creator/edit/preparation/row/delete", VerifyToken_1.VerifyCreatorToken, RecipeController_2.UpdateRecipePreparationRowDelete);
route.put("/creator/edit/advanced/:id/:field", VerifyToken_1.VerifyCreatorToken, RecipeController_1.UpdateAdvanced);
route.delete("/creator/delete/recipe/:id", VerifyToken_1.VerifyCreatorToken, RecipeController_2.DeleteRecipe);
