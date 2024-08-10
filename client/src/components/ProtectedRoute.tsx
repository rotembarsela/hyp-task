import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/useAppProvider";
import { PropsWithChildren } from "react";

type ProtectedRouteProps = PropsWithChildren;
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAppContext();

  return user.email !== "" ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
