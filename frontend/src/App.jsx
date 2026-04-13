import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BrowsePage from "./pages/BrowsePage";
import AnimeDetailsPage from "./pages/AnimeDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "16px" }}>
        <nav style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/watchlist">Watchlist</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/anime/:id" element={<AnimeDetailsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}