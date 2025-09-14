"use client";

import React from "react";
import slugify from "slugify";
import { cn } from "@/lib/utils";

import { useCategories } from "@/hooks/useCategories";
import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { addOrUpdateSubCategoryValidation } from "@/lib/validations/validationSchema";
import { useSubCategories } from "@/hooks/useSubCategories";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryList } from "@/types/dashboad.admin.type";

const UpdateSubCategory = () => {
  const { id } = useParams();
  const router = useRouter();
  const subCategoryId = Array.isArray(id) ? id[0] : id;

  const { useGetSubcategoryById, useUpdateSubcategory } = useSubCategories();
  const { useGetCategories } = useCategories();
  const { data, isLoading: isLoadingGetCagories } = useGetCategories({
    limit: undefined,
  });

  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    category_id: "",
  });
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);

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

  const {
    data: subCategory,
    isLoading,
    isError,
  } = useGetSubcategoryById(subCategoryId || "");

  React.useEffect(() => {
    if (subCategory) {
      setFormData({
        name: subCategory.data.name,
        slug: subCategory.data.slug,
        category_id: subCategory.data.category_id,
      });
    }
  }, [subCategory]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validasi frontend
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

    await useUpdateSubcategory.mutateAsync(
      { id: subCategoryId!, ...formData },
      {
        onSuccess: () => {
          router.replace("/admin/pages/sub-categories/list");
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
      router.replace("/admin/pages/sub-categories/list");
    }
  }, [isError, router]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return null;

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Update Sub Category</h1>
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
              <Label htmlFor="category">Category</Label>
              {!isLoadingGetCagories && (
                <Select
                  key={formData.category_id}
                  value={formData.category_id || undefined}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {data?.data?.map((item: CategoryList) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
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

export default UpdateSubCategory;
