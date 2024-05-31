"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRecipe = exports.GetAllLikedRecipes = exports.AddRecipePreparationRow = exports.AddRecipeIngredientRow = exports.LikeRecipe = exports.UpdateAdvanced = exports.UpdateRecipePreparationRowDelete = exports.UpdateRecipePreparationRow = exports.UpdateRecipeIngredientRowDelete = exports.UpdateRecipeIngredientRow = exports.UpdateRecipeDescription = exports.UpdateRecipePrepTime = exports.UpdateRecipeImage = exports.UpdateRecipeTitle = exports.UserHistory = exports.SingleRecipe = exports.SearchRecipes = exports.AllUserRecipes = exports.AllAdminRecipes = exports.AdminUpdateRecipeStatus = exports.AdminAllRecipes = exports.CreatorSingleRecipe = exports.AllCreatorRecipes = exports.NewRecipe = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Constant_1 = require("../constants/Constant");
const RecipeModel_1 = require("../models/RecipeModel");
const UserModel_1 = require("../models/UserModel");
const chalk_1 = __importDefault(require("chalk"));
// New Recipe - Creator
const NewRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, description, preparation, ingredients, advanced, prepTime } = req.body;
        const newPreparation = JSON.parse(preparation);
        const newIngredients = JSON.parse(ingredients);
        const newAdvanced = JSON.parse(advanced);
        const recipe = new RecipeModel_1.Recipe({ title, description, preparation: newPreparation, ingredients: newIngredients, advanced: newAdvanced, prepTime, creatorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, img: (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename });
        yield recipe.save();
        res.json({ status: true, message: "Recipe successfully submitted" });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.status(500).json({ message: "Internal Error" });
    }
});
exports.NewRecipe = NewRecipe;
// All Creator Recipes
const AllCreatorRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const recipes = yield RecipeModel_1.Recipe.find({ creatorId: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id });
        res.json({ status: true, message: "", recipes: recipes });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.status(500).json({ message: "Internal Error" });
    }
});
exports.AllCreatorRecipes = AllCreatorRecipes;
// Recipe Single View for Creator
const CreatorSingleRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const recipe = yield RecipeModel_1.Recipe.findOne({ _id: req.params.id, creatorId: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id });
        if (!recipe)
            return res.json({ message: "Recipe Not Found", status: false });
        res.json({ status: true, message: "Creator Single Recipe", recipe: recipe, });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.status(500).json({ message: "Internal Error" });
    }
});
exports.CreatorSingleRecipe = CreatorSingleRecipe;
// All Recipes for Admin
const AdminAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield RecipeModel_1.Recipe.find({ status: RecipeModel_1.RECIPE_STATUS.PENDING });
        const alterRecipes = yield recipes.map((recipes) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UserModel_1.User.findById(recipes.creatorId);
            return { recipes, creatorName: user === null || user === void 0 ? void 0 : user.name };
        }));
        res.send(yield Promise.all(alterRecipes));
    }
    catch (err) { }
});
exports.AdminAllRecipes = AdminAllRecipes;
// Update Recipe Status - Admin
const AdminUpdateRecipeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, status } = req.params;
        if (!id)
            return res.json({ message: "Invalid Recipe ID", status: false });
        const isRecipe = yield RecipeModel_1.Recipe.findById(id);
        if (!isRecipe)
            return res.json({ message: " Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(id, { status });
        res.json({ message: " Recipe updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.AdminUpdateRecipeStatus = AdminUpdateRecipeStatus;
// All Recipe - Admin
const AllAdminRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield RecipeModel_1.Recipe.find();
        const alterRecipes = yield recipes.map((recipes) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UserModel_1.User.findById(recipes.creatorId);
            return { recipes, creatorName: user === null || user === void 0 ? void 0 : user.name };
        }));
        res.send({ status: true, message: "All Recipes found", recipes: yield Promise.all(alterRecipes) });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.AllAdminRecipes = AllAdminRecipes;
// Fetch All recipe thar 
const AllUserRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield RecipeModel_1.Recipe.find({
            status: RecipeModel_1.RECIPE_STATUS.PUBLISHED,
        });
        const filterRecipe = recipes.filter((r) => r.advanced.visibility === true);
        res.json({ status: true, message: "", recipes: filterRecipe });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.AllUserRecipes = AllUserRecipes;
// Search Recipe based on title, description, ingredients, preparation time
const SearchRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield RecipeModel_1.Recipe.find({ $text: { $search: String(req.query.query) }, status: RecipeModel_1.RECIPE_STATUS.PUBLISHED });
        res.json({ status: true, message: "Searched Recipes", recipes: recipes });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.SearchRecipes = SearchRecipes;
// Single Recipe 
const SingleRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const token = req.headers["auth-token"];
        if (!id)
            throw new Error("Invalid id");
        const recipe = yield RecipeModel_1.Recipe.findById(id);
        if (!recipe || recipe.status !== RecipeModel_1.RECIPE_STATUS.PUBLISHED || !recipe.advanced.visibility)
            return res.json({ message: "Recipe not found", status: false });
        try {
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, Constant_1.secret);
                if (decoded) {
                    // @ts-expect-error
                    const userSaved = yield UserModel_1.User.findById(decoded._id);
                    // @ts-expect-error
                    if (!recipe.visitCount.includes(decoded._id))
                        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { $push: { visitCount: decoded._id }, });
                    return res.json({ status: true, message: "Recipe Found", recipe, isSaved: userSaved === null || userSaved === void 0 ? void 0 : userSaved.savedRecipes.includes(id) });
                }
            }
        }
        catch (err) {
            console.log(chalk_1.default.red(err));
        }
        res.json({ message: "Recipe Found", status: true, recipe });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.SingleRecipe = SingleRecipe;
// Fetch User History 
const UserHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req === null || req === void 0 ? void 0 : req.user;
        if (!user)
            return res.json({ status: false, message: "Something went wrong " });
        const history = yield RecipeModel_1.Recipe.find({ visitCount: { $elemMatch: { $eq: user === null || user === void 0 ? void 0 : user._id } }, status: RecipeModel_1.RECIPE_STATUS.PUBLISHED });
        res.json({ status: true, message: "", recipes: history });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UserHistory = UserHistory;
// Update Recipe Title
const UpdateRecipeTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { _id, title } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { title });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateRecipeTitle = UpdateRecipeTitle;
// Update Recipe Image
const UpdateRecipeImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const { _id } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { img: (_g = req.file) === null || _g === void 0 ? void 0 : _g.filename });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateRecipeImage = UpdateRecipeImage;
// Update Recipe Preparation Time string
const UpdateRecipePrepTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        const { _id, prepTime } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_h = req === null || req === void 0 ? void 0 : req.user) === null || _h === void 0 ? void 0 : _h._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { prepTime });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateRecipePrepTime = UpdateRecipePrepTime;
// Update Recipe Description
const UpdateRecipeDescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const { _id, description } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_j = req === null || req === void 0 ? void 0 : req.user) === null || _j === void 0 ? void 0 : _j._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { description });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateRecipeDescription = UpdateRecipeDescription;
// Update Single Recipe Ingredient Item / Element
const UpdateRecipeIngredientRow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    try {
        const { _id, ingredient } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_k = req === null || req === void 0 ? void 0 : req.user) === null || _k === void 0 ? void 0 : _k._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        const local = recipe.ingredients.map((ing) => (ing === null || ing === void 0 ? void 0 : ing._id) == (ingredient === null || ingredient === void 0 ? void 0 : ingredient._id) ? { ingredient: ingredient === null || ingredient === void 0 ? void 0 : ingredient.ingredient, _id: ingredient === null || ingredient === void 0 ? void 0 : ingredient._id } : ing);
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { ingredients: local });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateRecipeIngredientRow = UpdateRecipeIngredientRow;
// Delete Single Recipe Ingredient Item / Element
const UpdateRecipeIngredientRowDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        const { _id, ingredient } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_l = req === null || req === void 0 ? void 0 : req.user) === null || _l === void 0 ? void 0 : _l._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { $pull: { ingredients: { _id: ingredient === null || ingredient === void 0 ? void 0 : ingredient._id } } });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateRecipeIngredientRowDelete = UpdateRecipeIngredientRowDelete;
// Update Single Recipe Preparation Item / Element
const UpdateRecipePreparationRow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    try {
        const { _id, preparation } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_m = req === null || req === void 0 ? void 0 : req.user) === null || _m === void 0 ? void 0 : _m._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        const local = recipe.preparation.map((ing) => (ing === null || ing === void 0 ? void 0 : ing._id) == (preparation === null || preparation === void 0 ? void 0 : preparation._id) ? { name: preparation === null || preparation === void 0 ? void 0 : preparation.name, _id: preparation === null || preparation === void 0 ? void 0 : preparation._id } : ing);
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { preparation: local });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateRecipePreparationRow = UpdateRecipePreparationRow;
// Delete Single Recipe Ingredient Item / Element
const UpdateRecipePreparationRowDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    try {
        const { _id, preparation } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_o = req === null || req === void 0 ? void 0 : req.user) === null || _o === void 0 ? void 0 : _o._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { $pull: { preparation: { _id: preparation === null || preparation === void 0 ? void 0 : preparation._id } }, });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateRecipePreparationRowDelete = UpdateRecipePreparationRowDelete;
// Update Recipe Advanced Options 
const UpdateAdvanced = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    try {
        const { id, field } = req.params;
        if (!id || !field)
            return res.json({ message: "Invalid Parameter", status: false });
        const recipe = yield RecipeModel_1.Recipe.findOne({ _id: id, creatorId: (_p = req === null || req === void 0 ? void 0 : req.user) === null || _p === void 0 ? void 0 : _p._id });
        if (!recipe)
            return res.json({ message: "Recipe Not Found", status: false });
        // @ts-expect-error aaa
        recipe === null || recipe === void 0 ? void 0 : recipe.advanced[field] = !recipe.advanced[field];
        recipe === null || recipe === void 0 ? void 0 : recipe.save();
        // @ts-expect-error aaa
        res.json({ message: "Successfully Updated", status: true, [field]: recipe.advanced[field] });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UpdateAdvanced = UpdateAdvanced;
// Like Recipe
const LikeRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const token = req.headers["auth-token"];
        if (!id)
            throw new Error("Invalid id");
        const recipe = yield RecipeModel_1.Recipe.findById(id);
        if (!recipe || recipe.status !== RecipeModel_1.RECIPE_STATUS.PUBLISHED)
            return res.json({ message: "Recipe not found", status: false });
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, Constant_1.secret);
            if (decoded) {
                // @ts-expect-error
                if (recipe.likeRecipe.includes(decoded._id))
                    yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { $pull: { likeRecipe: decoded._id } });
                // @ts-expect-error
                else
                    yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { $push: { likeRecipe: decoded._id } });
            }
        }
        res.json({ status: true, message: "Recipe Found", recipe: yield RecipeModel_1.Recipe.findById(recipe._id) });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.LikeRecipe = LikeRecipe;
// Insert New Item to Ingredient
const AddRecipeIngredientRow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    try {
        const { _id, ingredient, index } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_q = req === null || req === void 0 ? void 0 : req.user) === null || _q === void 0 ? void 0 : _q._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { $push: { ingredients: { $each: [{ ingredient }], $position: index } } });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.AddRecipeIngredientRow = AddRecipeIngredientRow;
// Insert New Item to Preparation
const AddRecipePreparationRow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _r;
    try {
        const { _id, preparation, index } = req.body;
        const recipe = yield RecipeModel_1.Recipe.findOne({ creatorId: (_r = req === null || req === void 0 ? void 0 : req.user) === null || _r === void 0 ? void 0 : _r._id, _id });
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { $push: { preparation: { $each: [{ name: preparation }], $position: index } } });
        res.json({ message: "Recipe Successfully Updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.AddRecipePreparationRow = AddRecipePreparationRow;
// Get All Liked Recipes - User
const GetAllLikedRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _s;
    try {
        const recipes = yield RecipeModel_1.Recipe.find({ likeRecipe: (_s = req === null || req === void 0 ? void 0 : req.user) === null || _s === void 0 ? void 0 : _s._id });
        res.json({ message: "Recipe Successfully found", status: true, recipes });
    }
    catch (err) {
        console.log(err.message);
        res.json({ message: "Internal Error", err });
    }
});
exports.GetAllLikedRecipes = GetAllLikedRecipes;
// Delete Recipe - Creator
const DeleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.json({ message: "Invalid id", status: false });
        yield RecipeModel_1.Recipe.findByIdAndDelete(id);
        res.json({ message: "Recipe Successfully Deleted", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.DeleteRecipe = DeleteRecipe;
