import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/useAppProvider";
import { PropsWithChildren } from "react";

type ProtectedRouteProps = PropsWithChildren;
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { selectedUser } = useAppContext();

  return selectedUser.token !== "" ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
