// frontend/src/components/ProtectedRoute.jsx

import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { authState } from "../state/authState";
import LoadingState from "./LoadingState";

export default function ProtectedRoute({ children }) {
  const auth = useRecoilValue(authState);

  if (auth.isLoading) {
    return <LoadingState message="Checking login..." compact />;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}