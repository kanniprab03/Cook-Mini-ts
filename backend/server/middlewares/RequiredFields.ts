import { NextFunction, Request, Response } from "express";
import multiparty from "multiparty";

export const CheckFields =
  (fields: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];


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
