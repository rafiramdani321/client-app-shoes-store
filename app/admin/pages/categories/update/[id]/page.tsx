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
import { addOrUpdateCategoryValidation } from "@/lib/validations/validationSchema";

const UpdateCategory = () => {
  const { id } = useParams();
  const router = useRouter();
  const categoryId = Array.isArray(id) ? id[0] : id;
  const { getCategoyById, updateCategory } = useCategories();
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
  });
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);

  const inputRef = React.useRef<{
    name: HTMLInputElement | null;
    slug: HTMLInputElement | null;
  }>({
    name: null,
    slug: null,
  });

  React.useEffect(() => {
    if (!autoFocus) return;
    if (errorsInput.name && inputRef.current.name) {
      inputRef.current.name.focus();
    } else if (errorsInput.slug && inputRef.current.slug) {
      inputRef.current.slug.focus();
    }
    setAutoFocus(false);
  }, [errorsInput, autoFocus]);

  const {
    data: category,
    isLoading,
    isError,
  } = getCategoyById(categoryId || "");

  React.useEffect(() => {
    if (!categoryId) return;

    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
      });
    }
  }, [category, categoryId]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "slug" ? slugify(value, { lower: true }) : value,
    }));

    setErrorsInput({});
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validasi frontend
    const errorsValidationFront =
      addOrUpdateCategoryValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      showToastError("Validation failed.");
      setLoading(false);
      return;
    }

    await updateCategory.mutateAsync(
      { id: categoryId!, ...formData },
      {
        onSuccess: () => {
          router.replace("/admin/pages/categories/list");
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
      router.replace("/admin/pages/categories/list");
    }
  }, [isError, router]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return null;

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Update Category</h1>
      <div className="max-w-full xl:max-w-xl mt-5">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                ref={(e) => {
                  inputRef.current.name = e;
                }}
                autoFocus
                id="name"
                name="name"
                placeholder="name"
                className={cn(
                  "focus:ring-1 focus:ring-primary",
                  errorsInput.name?.length &&
                    "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                )}
                value={formData.name}
                onChange={handleOnChange}
              />
              {errorsInput.name?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >{`- ${msg}`}</p>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                ref={(e) => {
                  inputRef.current.slug = e;
                }}
                id="slug"
                name="slug"
                placeholder="slug"
                className={cn(
                  "focus:ring-1 focus:ring-primary",
                  errorsInput.slug?.length &&
                    "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                )}
                value={formData.slug}
                onChange={handleOnChange}
              />
              {errorsInput.slug?.map((msg, i) => (
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
