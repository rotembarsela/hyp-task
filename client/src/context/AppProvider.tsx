import { ReactNode, useState } from "react";
import { User } from "../types";
import { AppContext } from "./AppContext";

const initialUser: User = {
  email: "",
  name: "",
  israeliId: 0,
  phone: 0,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(initialUser);

  const handleUserSelection = (u: User) => {
    setUser(u);
  };

  return (
    <AppContext.Provider value={{ user, handleUserSelection }}>
      {children}
    </AppContext.Provider>
  );
};
