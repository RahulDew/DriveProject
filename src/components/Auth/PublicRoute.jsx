import { useAuthContext } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
const PublicRoute = ({}) => {
  const { currentUser } = useAuthContext();
  return currentUser?.emailVerified ? (
    <Navigate to={"/"} replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
