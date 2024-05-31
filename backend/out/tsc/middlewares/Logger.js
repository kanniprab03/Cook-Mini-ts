"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function Logger(req, res, next) {
    const date = new Date();
    let color;
    switch (req.method) {
        case "GET":
            color = "green";
            break;
        case "POST":
            color = "yellow";
            break;
        case "PUT":
            color = "blue";
            break;
        case "DELETE":
            color = "red";
            break;
    }
    console.log(chalk_1.default.green(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()), chalk_1.default.green(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()), req.method === "GET" ? chalk_1.default.green(req.method, req.url) : req.method === "POST" ? chalk_1.default.yellow(req.method, req.url) : req.method === "PUT" ? chalk_1.default.blue(req.method, req.url) : req.method === "DELETE" && chalk_1.default.red(req.method, req.url));
    next();
}
exports.default = Logger;
;
