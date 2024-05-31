import { createContext, useContext } from "react";

export interface ViewContextType {
  header: boolean;
  setHeader: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context)
    throw new Error("ViewContext must be used inside a ViewContext instance");
  return context;
};
