"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { buildErrorMap } from "@/lib/errorMap";
import { validationResponses } from "@/lib/validations";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { registerValidation } from "@/lib/validations/validationSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [visiblePassword, setVisiblePassword] = React.useState({
    password: false,
    confirmPassword: false,
  });
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});

  const inputRef = React.useRef<{
    username: HTMLInputElement | null;
    email: HTMLInputElement | null;
    password: HTMLInputElement | null;
    confirmPassword: HTMLInputElement | null;
  }>({
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const IconPassword = visiblePassword.password ? Eye : EyeOff;
  const IconConfirmPassword = visiblePassword.confirmPassword ? Eye : EyeOff;

  React.useEffect(() => {
    if (!autoFocus) return;
    if (errors.username && inputRef.current.username) {
      inputRef.current.username.focus();
    } else if (errors.email && inputRef.current.email) {
      inputRef.current.email.focus();
    } else if (errors.password && inputRef.current.password) {
      inputRef.current.password.focus();
    } else if (errors.confirmPassword && inputRef.current.confirmPassword) {
      inputRef.current.confirmPassword.focus();
    }
    setAutoFocus(false);
  }, [errors, autoFocus]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errorsValidationFront = registerValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrors(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch(`/auth/register`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.details && Array.isArray(data.details)) {
          setAutoFocus(true);
          setErrors(buildErrorMap<keyof typeof formData>(data.details));
        }
        showToastError(data.error, "top-right", 4000);
        return;
      }

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});

      showToastSuccess(data.message, "top-center", 6000);
      router.push("/auth/signin");
    } catch (error) {
      showToastError("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen px-1 sm:px-0">
      <Card className="w-full max-w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle className="uppercase">Sign up</CardTitle>
          <CardDescription>
            Please fill in all the input to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="block sm:flex sm:gap-x-4">
              <div className="w-full mb-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  autoFocus
                  ref={(e) => {
                    inputRef.current.username = e;
                  }}
                  type="text"
                  id="username"
                  name="username"
                  aria-invalid={!!errors.username?.length}
                  placeholder="username"
                  value={formData.username}
                  onChange={handleOnChange}
                  className={clsx(
                    "focus:ring-1 focus:ring-primary",
                    errors.username?.length &&
                      "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  )}
                />
                {errors.username?.map((msg, i) => (
                  <p
                    key={i}
                    className="text-rose-500 text-[11px] ml-1 font-semibold"
                  >{`- ${msg}`}</p>
                ))}
              </div>
              <div className="w-full mb-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  ref={(e) => {
                    inputRef.current.email = e;
                  }}
                  type="email"
                  id="email"
                  name="email"
                  aria-invalid={!!errors.email?.length}
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleOnChange}
                  className={clsx(
                    "focus:ring-1 focus:ring-primary",
                    errors.email?.length &&
                      "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  )}
                />
                {errors.email?.map((msg, i) => (
                  <p
                    key={i}
                    className="text-rose-500 text-[11px] ml-1 font-semibold"
                  >{`- ${msg}`}</p>
                ))}
              </div>
            </div>
            <div className="relative mb-3">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={(e) => {
                  inputRef.current.password = e;
                }}
                type={visiblePassword.password ? "text" : "password"}
                id="password"
                name="password"
                aria-invalid={!!errors.password?.length}
                value={formData.password}
                onChange={handleOnChange}
                className={clsx(
                  "pr-10 focus:ring-1 focus:ring-primary",
                  errors.password?.length &&
                    "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                )}
              />
              <div className="absolute right-0 top-[34px] mr-3">
                <IconPassword
                  onClick={() =>
                    setVisiblePassword((prev) => ({
                      ...prev,
                      password: !visiblePassword.password,
                    }))
                  }
                  className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary"
                />
              </div>
              {errors.password?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >{`- ${msg}`}</p>
              ))}
            </div>
            <div className="relative">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                ref={(e) => {
                  inputRef.current.confirmPassword = e;
                }}
                type={visiblePassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                aria-invalid={!!errors.confirmPassword?.length}
                value={formData.confirmPassword}
                onChange={handleOnChange}
                className={clsx(
                  "pr-10 focus:ring-1 focus:ring-primary",
                  errors.confirmPassword?.length &&
                    "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                )}
              />
              <div className="absolute right-0 top-[34px] mr-3">
                <IconConfirmPassword
                  onClick={() =>
                    setVisiblePassword((prev) => ({
                      ...prev,
                      confirmPassword: !visiblePassword.confirmPassword,
                    }))
                  }
                  className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary"
                />
              </div>
              {errors.confirmPassword?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >{`- ${msg}`}</p>
              ))}
            </div>
            <div className="mt-5 grid gap-3">
              <Button disabled={loading} type="submit" className="w-full">
                {!loading ? (
                  "Sign Up"
                ) : (
                  <LoaderCircle className="animate-spin" />
                )}
              </Button>
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                className="w-full"
              >
                Sign up with Google
              </Button>
            </div>
            <div className="flex justify-center text-xs gap-x-1 text-muted-foreground mt-4">
              <p>Already have an account:</p>
              <Link
                href="/auth/signin"
                className="hover:underline hover:text-primary uppercase font-semibold"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
