// frontend/src/components/ProtectedRoute.jsx

import { useRecoilValue } from "recoil";
import { Navigate, useLocation } from "react-router-dom";
import { authState } from "../state/authState";
import LoadingState from "./LoadingState";

export default function ProtectedRoute({ children }) {
  const auth = useRecoilValue(authState);
  const location = useLocation();

  if (auth.isLoading) {
    return <LoadingState message="Checking login..." compact />;
  }

  if (!auth.user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}