"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckFields = void 0;
const CheckFields = (fields) => (req, res, next) => {
    const missingFields = [];
    fields.forEach((field) => {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    });
    if (missingFields.length > 0) {
        if (missingFields.find((f) => f === "img")) {
            return next();
        }
        return res.status(400).json({
            message: `Missing fields: ${missingFields}`,
        });
    }
    next();
};
exports.CheckFields = CheckFields;
