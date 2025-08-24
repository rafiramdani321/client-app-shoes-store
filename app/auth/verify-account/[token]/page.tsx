"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckIcon, Loader2, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import clsx from "clsx";

import { apiFetch } from "@/lib/api";
import { UserDecodedPayload } from "@/types/user.type";
import { useAuthStore } from "@/stores/useAuthStore";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VerifyAccount = () => {
  const router = useRouter();
  const { token } = useParams();
  const { setAccessToken, accessToken, setUser } = useAuthStore();

  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    "loading"
  );
  const [loadingResend, setLoadingResend] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [resendEmail, setResendEmail] = React.useState(false);

  const hasRun = React.useRef(false);
  React.useEffect(() => {
    if (!token || hasRun.current) return;
    handleVerifyAccount();
  }, [token, accessToken]);

  const handleVerifyAccount = async () => {
    hasRun.current = true;

    try {
      const res = await apiFetch(
        `/auth/verify-email/${token}`,
        {
          method: "GET",
        },
        { withAuth: false }
      );

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        if (
          data.details !== null &&
          data.details[0].field === "token_has_expired"
        ) {
          setResendEmail(true);
        }
        setMessage(data.error);
        return;
      }

      setStatus("success");
      setMessage(data.message);

      const accessToken = data.data.accessToken;
      const decoded = jwtDecode<UserDecodedPayload>(accessToken);
      setAccessToken(accessToken);
      setUser(decoded);

      router.push("/");
    } catch (error) {
      showToastError("Something went wrong.");
    }
  };

  let Icon;
  if (status === "error") {
    Icon = X;
  } else if (status === "success") {
    Icon = CheckIcon;
  } else {
    Icon = Loader2;
  }

  const handleResendEmail = async () => {
    if (!token) return;
    const tokenStr = Array.isArray(token) ? token[0] : token;
    const decoded = jwtDecode(tokenStr);
    setLoadingResend(true);
    try {
      const res = await apiFetch(
        `/auth/resend-email-verification`,
        {
          method: "POST",
          body: JSON.stringify(decoded),
        },
        { withAuth: false }
      );
      const data = await res.json();

      if (!res.ok) {
        showToastError("Something went wrong.");
        return;
      }

      showToastSuccess(data.message, "top-center", 6000);
      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen px-1 sm:px-0">
      <Card
        className={clsx(
          "w-full max-w-full sm:max-w-md",
          status === "error" && "shadow-rose-400",
          status === "success" && "shadow-emerald-400"
        )}
      >
        <CardHeader>
          <CardTitle>Verification your account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-x-3">
            <Icon
              className={clsx(
                "w-16 h-16 border rounded-full",
                status === "success" &&
                  "text-emerald-500 bg-emerald-200 border-emerald-300",
                status === "error" &&
                  "text-rose-500 bg-rose-200 border-rose-300",
                status === "loading" &&
                  "animate-spin text-muted-foreground border-none"
              )}
            />
            <p className={clsx(status !== "loading" && "w-10/12")}>{message}</p>
          </div>
          <div className="mt-5 flex justify-center">
            {loadingResend ? (
              <Loader2 className="w-16 h-16 animate-spin text-muted-foreground" />
            ) : resendEmail && status === "error" ? (
              <Button
                disabled={loadingResend}
                onClick={() => handleResendEmail()}
              >
                Resend verification
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAccount;
