import mongoose from "mongoose";
import { DB_URI } from "../constants/Constant";
import chalk from "chalk";

export class Database {
  constructor() { }

  async connect() {
    try {
      mongoose.connect(process.env["DB_URI"]!);
      console.log(chalk.bgGreen(" Connected to Database "));
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log(chalk.bgRed(" Disconnected from Database "));
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
