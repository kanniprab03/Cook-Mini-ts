import { createContext, useContext } from "react";
import { AuthContextType } from "./types/Context";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("AuthContext must be used inside a AuthContext instance");
  return context;
};
