"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = exports.RECIPE_STATUS = void 0;
const mongoose_1 = require("mongoose");
var RECIPE_STATUS;
(function (RECIPE_STATUS) {
    RECIPE_STATUS["PUBLISHED"] = "published";
    RECIPE_STATUS["UNPUBLISHED"] = "unpublished";
    RECIPE_STATUS["PENDING"] = "pending";
    RECIPE_STATUS["removed"] = "removed";
})(RECIPE_STATUS || (exports.RECIPE_STATUS = RECIPE_STATUS = {}));
const recipeSchema = new mongoose_1.Schema({
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
exports.Recipe = (0, mongoose_1.model)("recipes", recipeSchema);
