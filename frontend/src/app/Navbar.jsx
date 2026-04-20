import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function getNavLinkClassName({ isActive }) {
  return `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;
}

export default function Navbar({ user, onLogout }) {
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <NavLink to="/" className={styles.brand}>
            Mini Anime List
          </NavLink>

          <nav className={styles.navLinks} aria-label="Main navigation">
            <NavLink to="/" end className={getNavLinkClassName}>
              Home
            </NavLink>

            <NavLink to="/browse" className={getNavLinkClassName}>
              Browse
            </NavLink>

            {user ? (
              <NavLink to="/watchlist" className={getNavLinkClassName}>
                Watchlist
              </NavLink>
            ) : null}
          </nav>
        </div>

        <div className={styles.right}>
          {user ? (
            <>
              <span className={styles.userPill}>Hello, {user.username}</span>
              <button
                type="button"
                onClick={onLogout}
                className={styles.logoutButton}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={`${styles.authButton} ${styles.authButtonSecondary}`}
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className={`${styles.authButton} ${styles.authButtonPrimary}`}
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}