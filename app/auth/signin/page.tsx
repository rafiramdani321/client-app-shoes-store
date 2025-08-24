"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { showToastError } from "@/lib/toast";
import { jwtDecode } from "jwt-decode";
import { UserDecodedPayload } from "@/types/user.type";
import { useAuthStore } from "@/stores/useAuthStore";
import { buildErrorMap } from "@/lib/errorMap";
import clsx from "clsx";
import { loginValidation } from "@/lib/validations/validationSchema";
import { validationResponses } from "@/lib/validations";

const Signin = () => {
  const router = useRouter();
  const { setAccessToken, setUser } = useAuthStore();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [visiblePassword, setVisiblePassword] = React.useState(false);
  const [error, setErrors] = React.useState("");
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});

  const inputRef = React.useRef<{
    email: HTMLInputElement | null;
    password: HTMLInputElement | null;
  }>({
    email: null,
    password: null,
  });

  React.useEffect(() => {
    if (!autoFocus) return;
    if (errorsInput.email && inputRef.current.email) {
      inputRef.current.email.focus();
    } else if (errorsInput.password && inputRef.current.password) {
      inputRef.current.password.focus();
    }
    setAutoFocus(false);
  }, [errorsInput, autoFocus]);

  const IconPassword = visiblePassword ? Eye : EyeOff;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors("");

    setErrorsInput((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errorsValidationFront = loginValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch(`/auth/login`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setAutoFocus(true);
        showToastError("Validation failed.");
        if (data.details && Array.isArray(data.details)) {
          setErrorsInput(buildErrorMap<keyof typeof formData>(data.details));
        } else {
          setErrors(data.error);
        }
        return;
      }

      setFormData({ email: "", password: "" });
      setErrorsInput({});
      setErrors("");

      const accessToken = data.data.accessToken;
      const decoded = jwtDecode<UserDecodedPayload>(accessToken);
      setAccessToken(accessToken);
      setUser(decoded);

      router.push("/");
    } catch (error) {
      showToastError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen px-1 sm:px-0">
      <Card className="w-full max-w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Enter the fields and below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error !== "" ? (
            <div className="flex items-center gap-x-1 mb-4">
              <div className="border rounded-full p-0.5 bg-rose-200">
                <X className="text-rose-500 w-4 h-4" />
              </div>
              <p className="text-rose-500 font-semibold text-sm">{error}</p>
            </div>
          ) : null}
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  ref={(e) => {
                    inputRef.current.email = e;
                  }}
                  autoFocus
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleOnChange}
                  className={clsx(
                    "focus:ring-1 focus:ring-primary",
                    errorsInput.email?.length &&
                      "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  )}
                />
                {errorsInput.email?.map((msg, i) => (
                  <p
                    key={i}
                    className="text-rose-500 text-[11px] ml-1 font-semibold"
                  >{`- ${msg}`}</p>
                ))}
              </div>
              <div className="grid gap-1 relative">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  ref={(e) => {
                    inputRef.current.password = e;
                  }}
                  id="password"
                  name="password"
                  type={visiblePassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleOnChange}
                  className={clsx(
                    "pr-10 focus:ring-1 focus:ring-primary",
                    errorsInput.password?.length &&
                      "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  )}
                />
                <div className="absolute right-0 top-[35px] mr-3">
                  <IconPassword
                    className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary"
                    onClick={() => setVisiblePassword(!visiblePassword)}
                  />
                </div>
                {errorsInput.password?.map((msg, i) => (
                  <p
                    key={i}
                    className="text-rose-500 text-[11px] ml-1 font-semibold"
                  >{`- ${msg}`}</p>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <Button disabled={loading} type="submit" className="w-full">
                {!loading ? (
                  "Sign In"
                ) : (
                  <LoaderCircle className="animate-spin" />
                )}
              </Button>
              <Button disabled={loading} variant="outline" className="w-full">
                Sign in with Google
              </Button>
            </div>
            <div className="flex justify-center text-xs gap-x-1 text-muted-foreground mt-4">
              <p>Don't have an account:</p>
              <Link
                href="/auth/signup"
                className="hover:underline uppercase font-semibold hover:text-primary"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signin;
