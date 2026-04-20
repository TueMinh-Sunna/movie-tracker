import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BrowsePage from "./pages/BrowsePage";
import AnimeDetailsPage from "./pages/AnimeDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { authState } from "./state/authState";
import { logoutUser } from "./api/authApi";
import AppShell from "./app/AppShell";
import useAuthBootstrap from "./hooks/useAuthBootstrap";

function AppRoutes() {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  useAuthBootstrap(setAuth);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // even if logout request fails, clear frontend auth
    }

    setAuth({
      user: null,
      isLoading: false,
    });

    navigate("/login");
  }

  return (
    <Routes>
      <Route element={<AppShell user={auth.user} onLogout={handleLogout} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/anime/:id" element={<AnimeDetailsPage />} />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}