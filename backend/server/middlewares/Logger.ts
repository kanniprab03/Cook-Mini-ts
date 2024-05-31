import { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import { url } from "inspector";

export default function Logger(req: Request, res: Response, next: NextFunction) {
  const date = new Date();
  let color;

  switch (req.method) {
    case "GET": color = "green"; break;
    case "POST": color = "yellow"; break;
    case "PUT": color = "blue"; break;
    case "DELETE": color = "red"; break;
  }

  console.log(
    chalk.green(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()),
    chalk.green(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()),
    req.method === "GET" ? chalk.green(req.method, req.url) : req.method === "POST" ? chalk.yellow(req.method, req.url) : req.method === "PUT" ? chalk.blue(req.method, req.url) : req.method === "DELETE" && chalk.red(req.method, req.url)
  );
  next()
};
