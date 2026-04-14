import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { authState } from "../state/authState";

export default function ProtectedRoute({ children }) {
  const auth = useRecoilValue(authState);

  if (auth.isLoading) {
    return <p>Checking login...</p>;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}