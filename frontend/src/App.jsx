import { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BrowsePage from "./pages/BrowsePage";
import AnimeDetailsPage from "./pages/AnimeDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { authState } from "./state/authState";
import { getCurrentUser, logoutUser } from "./api/authApi";

function AppLayout() {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser();
        setAuth({
          user,
          isLoading: false,
        });
      } catch {
        setAuth({
          user: null,
          isLoading: false,
        });
      }
    }

    loadCurrentUser();
  }, [setAuth]);

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
    <div style={{ padding: "16px" }}>
      <nav style={{ marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>

        {auth.user ? (
          <>
            <Link to="/watchlist">Watchlist</Link>
            <span>Hello, {auth.user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>

      <Routes>
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
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}