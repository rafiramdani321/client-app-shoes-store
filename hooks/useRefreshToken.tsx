import React from "react";
import { jwtDecode } from "jwt-decode";

import { apiFetch } from "@/lib/api";
import { UserDecodedPayload } from "@/types/user.type";
import { useAuthStore } from "@/stores/useAuthStore";

export const useRefreshTokenOnMount = () => {
  const { clearAccessToken, setAccessToken, setAuthResolved, setUser } =
    useAuthStore();

  const hasRefresh = React.useRef(false);

  React.useEffect(() => {
    if (hasRefresh.current) return;

    const refresh = async () => {
      try {
        const res = await apiFetch(
          `/auth/refresh-token`,
          {
            method: "GET",
          },
          { withAuth: false }
        );

        const data = await res.json();

        if (!res.ok) {
          clearAccessToken();
          if (res.status === 401) {
            console.log("No valid refresh token, skipping access token init.");
          }
          return;
        }

        const token = data.data.accessToken;
        const decoded = jwtDecode<UserDecodedPayload>(token);
        setAccessToken(token);
        setUser(decoded);
      } catch (error) {
        clearAccessToken();
      } finally {
        setAuthResolved(true);
      }
    };

    refresh();
    hasRefresh.current = true;
  }, [hasRefresh, setAccessToken]);
};
