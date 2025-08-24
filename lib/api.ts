import { useAuthStore } from "@/stores/useAuthStore";
import { UserDecodedPayload } from "@/types/user.type";
import { jwtDecode } from "jwt-decode";

export const apiFetch = async (
  url: string,
  options?: RequestInit,
  { withAuth = true, retry = true } = {}
): Promise<Response> => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { accessToken, setAccessToken, clearAccessToken, setUser } =
    useAuthStore.getState();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (withAuth && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const doFetch = (token: string | null) =>
    fetch(`${base}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...(withAuth ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

  let res = await doFetch(accessToken);

  if (res.status === 401 && retry && withAuth) {
    try {
      const refreshRes = await fetch(`${base}/auth/refresh-token`, {
        method: "GET",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        clearAccessToken();
        return res;
      }

      const newToken = (await refreshRes.json()).data.accessToken;
      const decoded = jwtDecode<UserDecodedPayload>(newToken);
      setAccessToken(newToken);
      setUser(decoded);

      res = await doFetch(newToken);
    } catch {
      clearAccessToken();
    }
  }

  return res;
};
