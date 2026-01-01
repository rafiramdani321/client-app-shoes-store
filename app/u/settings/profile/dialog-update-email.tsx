"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/hooks/useUsers";
import { buildErrorMap } from "@/lib/errorMap";
import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";
import { updateEmailMeValidation } from "@/lib/validations/validationSchema";
import { DialogTitle } from "@radix-ui/react-dialog";
import React from "react";

interface DialogUpdateEmailProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialodUpdateEmail = ({
  openDialog,
  setOpenDialog,
}: DialogUpdateEmailProps) => {
  const { updateEmailMe } = useUsers();

  const [formData, setFormData] = React.useState({
    email: "",
  });
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!openDialog) {
      setFormData({ email: "" });
      setErrors({});
      setMessage("");
    }
  }, [openDialog]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorFrontValidation = updateEmailMeValidation.safeParse(formData);
    if (!errorFrontValidation.success) {
      const errorFront = validationResponses(errorFrontValidation);
      setErrors(buildErrorMap<keyof typeof formData>(errorFront));
      showToastError("Validation failed.");
      return;
    }

    await updateEmailMe.mutateAsync(formData.email, {
      onSuccess: () => {
        setErrors({});
        setOpenDialog(false);
      },
      onError: (err: any) => {
        if (err.details && Array.isArray(err.details)) {
          setErrors(buildErrorMap<keyof typeof formData>(err.details));
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
            Update Email
          </DialogTitle>
          <DialogDescription className="hidden">Update email</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateEmail}>
          {message && (
            <p className="mb-2 font-semibold text-sm text-red-500">{message}</p>
          )}
          <div>
            <Label htmlFor="email">New Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="mail@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
                setErrors({});
                setMessage("");
              }}
            />
            {errors.email?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >
                {`- ${msg}`}
              </p>
            ))}
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-3">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpenDialog(false)}
              disabled={updateEmailMe.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={updateEmailMe.isPending}
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialodUpdateEmail;
