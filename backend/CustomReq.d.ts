type IUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: USER_ROLE;
  loginCount: number;
  profileImg?: string;
  savedRecipes: string[];
};

declare namespace Express {
  export interface Request {
    user?: IUser;
  }
}
