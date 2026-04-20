import { useEffect } from "react";
import { getCurrentUser } from "../api/authApi";

export default function useAuthBootstrap(setAuth) {
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
}