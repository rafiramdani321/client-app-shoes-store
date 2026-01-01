"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/hooks/useUsers";
import { buildErrorMap } from "@/lib/errorMap";
import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";
import { setPasswordValidation } from "@/lib/validations/validationSchema";
import { Dialog } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import React from "react";

interface DialogSetPasswordProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogSetPassword = ({
  openDialog,
  setOpenDialog,
}: DialogSetPasswordProps) => {
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
  });
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!openDialog) {
      setFormData({
        password: "",
        confirmPassword: "",
      });
      setErrorsInput({});
      setMessage("");
    }
  }, [openDialog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorsInput({});
    setMessage("");
  };

  const { setMyPassword } = useUsers();

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorsValidationFront = setPasswordValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorFront));
      showToastError("Validation failed.");
      return;
    }

    await setMyPassword.mutateAsync(formData, {
      onSuccess: () => {
        setErrorsInput({});
        setMessage("");
        router.replace("/auth/sign");
      },
      onError: (err: any) => {
        if (err.details && Array.isArray(err.details)) {
          setErrorsInput(buildErrorMap<keyof typeof formData>(err.details));
        } else {
          setMessage(err.message || "Something went wrong");
        }
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">
            Set Password
          </DialogTitle>
          <DialogDescription>
            Create a password to enable login using email and password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSetPassword} className="space-y-3">
          {message && (
            <p className="font-semibold text-sm text-red-500">{message}</p>
          )}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errorsInput.password?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >
                {`-${msg}`}
              </p>
            ))}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errorsInput.confirmPassword?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >
                {`-${msg}`}
              </p>
            ))}
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-3">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpenDialog(false)}
              disabled={setMyPassword.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={setMyPassword.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSetPassword;
