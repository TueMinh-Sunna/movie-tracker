import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppShell({ user, onLogout }) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />

      <main
        style={{
          width: "min(100% - 32px, var(--content-width-lg))",
          margin: "0 auto",
          paddingBottom: "32px",
        }}
      >
        <Outlet />
      </main>
    </>
  );
}