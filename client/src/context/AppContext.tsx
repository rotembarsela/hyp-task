import { createContext } from "react";
import { User } from "../types";

interface AppContextType {
  user: User;
  handleUserSelection: (u: User) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
