"use client";

import React from "react";
import slugify from "slugify";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { useCategories } from "@/hooks/useCategories";
import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addOrUpdateSizeValidation } from "@/lib/validations/validationSchema";
import { useSizes } from "@/hooks/useSizes";

const UpdateCategory = () => {
  const { id } = useParams();
  const router = useRouter();
  const sizeId = Array.isArray(id) ? id[0] : id;
  const { updateSize, getSizeById } = useSizes();
  const [formData, setFormData] = React.useState({
    size: "",
  });
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);

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

  const { data: sizes, isLoading, isError } = getSizeById(sizeId || "");

  React.useEffect(() => {
    if (!sizeId) return;

    if (sizes) {
      console.log(sizes);
      setFormData({
        size: sizes.size,
      });
    }
  }, [sizes, sizeId]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorsInput({});
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validasi frontend
    const errorsValidationFront = addOrUpdateSizeValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      showToastError("Validation failed.");
      setLoading(false);
      return;
    }

    await updateSize.mutateAsync(
      { id: sizeId!, ...formData },
      {
        onSuccess: () => {
          router.replace("/admin/pages/sizes/list");
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
      }
    );
  };

  React.useEffect(() => {
    if (isError) {
      router.replace("/admin/pages/sizes/list");
    }
  }, [isError, router]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return null;

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Update Size</h1>
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
                placeholder="size"
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

export default UpdateCategory;
