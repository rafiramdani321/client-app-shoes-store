"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { jwtDecode } from "jwt-decode";
import { UserDecodedPayload } from "@/types/user.type";

const VerifyNewEmail = () => {
  const router = useRouter();
  const params = useParams();

  const token =
    typeof params.token === "string" ? params.token : params.token?.[0];

  const { setAccessToken, setUser } = useAuthStore();

  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    "loading"
  );

  const hashRun = React.useRef(false);

  React.useEffect(() => {
    if (!token || hashRun.current) return;
    handleVerifyNewEmail();
  }, [token]);

  const handleVerifyNewEmail = async () => {
    hashRun.current = true;

    try {
      const res = await apiFetch(
        `/users/verify-new-email/${token}`,
        { method: "GET" },
        { withAuth: false }
      );

      const result = await res.json();

      if (!res.ok) {
        setStatus("error");
        showToastError(result.error, "top-center", 5000);
        router.replace("/");
        return;
      }

      setStatus("success");

      const accessToken = result.data.accessToken;
      const decoded = jwtDecode<UserDecodedPayload>(accessToken);

      setAccessToken(accessToken);
      setUser(decoded);

      showToastSuccess(result.message, "top-center", 5000);
      router.replace("/");
    } catch (err: any) {
      setStatus("error");
      showToastError("Something went wrong", "top-center", 5000);
      router.replace("/");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <p>
        {status === "loading" && "Verifying email..."}
        {status === "success" && "Verification success"}
        {status === "error" && "Verification failed"}
      </p>
    </div>
  );
};

export default VerifyNewEmail;
