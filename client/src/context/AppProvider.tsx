import { ReactNode, useEffect, useState } from "react";
import { User } from "../types";
import { AppContext } from "./AppContext";
import { APIFetcher } from "../utils/fetcher";

const initialUser: User = {
  id: 0,
  token: "",
  name: "",
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>(initialUser);

  const handleUserSelection = (u: User) => {
    setSelectedUser(u);
  };

  useEffect(() => {
    async function getUsers() {
      const usersResponse = await APIFetcher<User[], undefined>(
        "/users",
        "GET"
      );

      console.log(usersResponse);

      setUsers(usersResponse);
    }

    getUsers();
  }, []);

  return (
    <AppContext.Provider
      value={{
        users,
        selectedUser,
        handleUserSelection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
