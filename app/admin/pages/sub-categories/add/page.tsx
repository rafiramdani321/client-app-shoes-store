"use client";

import React from "react";
import slugify from "slugify";
import { cn } from "@/lib/utils";

import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubCategories } from "@/hooks/useSubCategories";
import { addOrUpdateSubCategoryValidation } from "@/lib/validations/validationSchema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { CategoryList } from "@/types/dashboad.admin.type";

const AddSubcategory = () => {
  const { useGetCategories } = useCategories();
  const { data, isLoading } = useGetCategories({ limit: undefined });

  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    category_id: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});

  const inputRef = React.useRef<{
    name: HTMLInputElement | null;
    slug: HTMLInputElement | null;
    category_id: HTMLInputElement | null;
  }>({
    name: null,
    slug: null,
    category_id: null,
  });

  React.useEffect(() => {
    if (!autoFocus) return;
    if (errorsInput.name && inputRef.current.name) {
      inputRef.current.name.focus();
    } else if (errorsInput.slug && inputRef.current.slug) {
      inputRef.current.slug.focus();
    } else if (errorsInput.category_id && inputRef.current.category_id) {
      inputRef.current.category_id.focus();
    }
    setAutoFocus(false);
  }, [errorsInput, autoFocus]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(value, { lower: true }),
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "slug" ? slugify(value, { lower: true }) : value,
    }));

    setErrorsInput({});
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
    setErrorsInput({});
  };

  const { useAddSubcategory } = useSubCategories();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errorsValidationFront =
      addOrUpdateSubCategoryValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      showToastError("Validation failed.");
      setLoading(false);
      return;
    }

    await useAddSubcategory.mutateAsync(formData, {
      onSuccess: () => {
        setFormData({ name: "", slug: "", category_id: "" });
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
      <h1 className="text-xl font-semibold">Add Sub Category</h1>
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
            <div className="grid gap-2">
              <Label htmlFor="slug">Category</Label>
              <Select
                value={formData.category_id}
                name="category_id"
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {isLoading ? (
                      <p>Loading...</p>
                    ) : (
                      data.data.map((item: CategoryList) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errorsInput.category_id?.map((msg, i) => (
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

export default AddSubcategory;
