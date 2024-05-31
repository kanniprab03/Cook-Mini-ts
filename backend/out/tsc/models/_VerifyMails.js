"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verify = void 0;
const mongoose_1 = require("mongoose");
const UserModel_1 = require("./UserModel");
const verifySchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: UserModel_1.USER_ROLE,
        required: true,
        default: UserModel_1.USER_ROLE.USER,
    },
    token: {
        type: String,
        required: true,
    },
});
exports.Verify = (0, mongoose_1.model)("verifyUser", verifySchema);
