"use client";

import React from "react";
import { cn } from "@/lib/utils";

import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addOrUpdateSizeValidation } from "@/lib/validations/validationSchema";
import { useSizes } from "@/hooks/useSizes";

const AddSize = () => {
  const [formData, setFormData] = React.useState({
    size: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});

  const inputRef = React.useRef<{
    size: HTMLInputElement | null;
  }>({
    size: null,
  });

  React.useEffect(() => {
    if (!autoFocus) return;
    if (errorsInput.size && inputRef.current.size) {
      inputRef.current.size.focus();
    }
    setAutoFocus(false);
  }, [errorsInput, autoFocus]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorsInput({});
  };

  const { addSize } = useSizes();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errorsValidationFront = addOrUpdateSizeValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      showToastError("Validation failed.");
      setLoading(false);
      return;
    }

    await addSize.mutateAsync(formData, {
      onSuccess: () => {
        setFormData({ size: "" });
        setErrorsInput({});
      },
      onError: (err: any) => {
        setAutoFocus(true);
        if (err.details && Array.isArray(err.details)) {
          setErrorsInput(buildErrorMap<keyof typeof formData>(err.details));
        }
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Add Size</h1>
      <div className="max-w-full xl:max-w-xl mt-5">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Size</Label>
              <Input
                ref={(e) => {
                  inputRef.current.size = e;
                }}
                autoFocus
                id="size"
                name="size"
                placeholder="Size"
                className={cn(
                  "focus:ring-1 focus:ring-primary",
                  errorsInput.size?.length &&
                    "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                )}
                value={formData.size}
                onChange={handleOnChange}
              />
              {errorsInput.size?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >{`- ${msg}`}</p>
              ))}
            </div>
            <div className="grid gap-2 mt-3">
              <Button disabled={loading}>Save</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSize;
