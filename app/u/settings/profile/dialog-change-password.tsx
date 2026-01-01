"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { changeMyPasswordValidation } from "@/lib/validations/validationSchema";
import { useRouter } from "next/navigation";
import React from "react";
import { string } from "zod";

interface DialogChangePasswordProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DialogChangePassword = ({
  openDialog,
  setOpenDialog,
}: DialogChangePasswordProps) => {
  const router = useRouter();

  const initialValue = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [formData, setFormData] = React.useState(initialValue);
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!openDialog) {
      setFormData(initialValue);
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

  const { changeMyPassword } = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorsValidationFront =
      changeMyPasswordValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorFront));
      showToastError("Validation failed.");
      return;
    }

    await changeMyPassword.mutateAsync(formData, {
      onSuccess: () => {
        setErrorsInput({});
        setMessage("");
        setFormData(initialValue);
        router.replace("/auth/signin");
      },
      onError: (error: any) => {
        if (error.details && Array.isArray(error.details)) {
          setErrorsInput(buildErrorMap<keyof typeof formData>(error.details));
          setFormData(initialValue);
        } else {
          setMessage(error.message || "Something went wrong.");
          setFormData(initialValue);
        }
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">
            Change Password
          </DialogTitle>
          <DialogDescription className="hidden">
            Change Password
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {message && (
            <p className="font-semibold text-sm text-red-500">{message}</p>
          )}
          <div>
            <Label htmlFor="oldPassword">Old password</Label>
            <Input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
            />
            {errorsInput.oldPassword?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >
                {`-${msg}`}
              </p>
            ))}
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {errorsInput.newPassword?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >
                {`-${msg}`}
              </p>
            ))}
          </div>
          <div>
            <Label htmlFor="confirmNewPassword">Confirm new password</Label>
            <Input
              type="password"
              name="confirmNewPassword"
              placeholder="Confrim new password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
            {errorsInput.confirmNewPassword?.map((msg, i) => (
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
              disabled={changeMyPassword.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={changeMyPassword.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
