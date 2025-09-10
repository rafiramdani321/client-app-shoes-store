"use client";

import React from "react";
import dynamic from "next/dynamic";
import slugify from "slugify";
import { Loader2, Trash } from "lucide-react";
import "react-quill/dist/quill.snow.css";

import { Hint } from "@/components/hint";
import { useSizes } from "@/hooks/useSizes";
import { useCategories } from "@/hooks/useCategories";
import { createOrUpdateProduct } from "@/lib/validations/validationSchema";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { showToastError } from "@/lib/toast";
import { CategoryList, SizeList } from "@/types/dashboad.admin.type";
import CategoriesSerive from "@/services/categories";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AddProduct = () => {
  const { useGetCategories } = useCategories();
  const { useGetSizes } = useSizes();
  const { data: sizesData, isLoading: loadingSizesData } = useGetSizes({
    limit: undefined,
  });
  const { data: categoriesData, isLoading: loadingCategoriesData } =
    useGetCategories({
      limit: undefined,
      sortBy: "created_at",
      sortOrder: "asc",
    });

  type SizeForm = {
    size_id: string;
    stock: string;
  };

  const initialFormData = {
    title: "",
    slug: "",
    description: "",
    price: "",
    category_id: "",
    subcategory_id: "",
    sizes: [] as SizeForm[],
    is_active: true,
    files: [] as File[],
  };

  const [formData, setFormData] = React.useState(initialFormData);
  const [tempSize, setTempSize] = React.useState<SizeForm>({
    size_id: "",
    stock: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [subcategoryData, setSubCategoryData] = React.useState<
    { id: string; name: string }[]
  >([]);

  React.useEffect(() => {
    if (formData.category_id !== "") {
      const fetchCategoryById = async () => {
        const res = await CategoriesSerive.getCategoryById(
          formData.category_id
        );
        setSubCategoryData(res.SubCategory);
      };
      fetchCategoryById();
    }
  }, [formData.category_id]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files) {
      const newFiles = Array.from(files);
      if (formData.files.length + newFiles.length > 5) {
        showToastError("You can only upload up to 5 images");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
      setErrorsInput({});
      return;
    }

    if (name === "title") {
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

  const handleSelectChangeCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
    setErrorsInput({});
  };

  const handleSelectChangeSubCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategory_id: value,
    }));
    setErrorsInput({});
  };

  const handleAddSize = () => {
    setErrorsInput({});
    if (!tempSize.size_id || !tempSize.stock) {
      showToastError("size and stock is required.");
      return;
    }

    const exists = formData.sizes.find((s) => s.size_id === tempSize.size_id);
    if (exists) {
      showToastError("size already exist");
    } else {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, tempSize],
      }));
    }

    setTempSize({ size_id: "", stock: "" });
  };

  const handleRemoveSize = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s.size_id !== id),
    }));
  };

  const { addProduct } = useProducts();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errorsValidationFront = createOrUpdateProduct.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorsFront));
      showToastError("Validation failed.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      sizes: formData.sizes.map((s) => ({
        ...s,
        stock: Number(s.stock),
      })),
    };

    await addProduct.mutateAsync(payload, {
      onSuccess: () => {
        setFormData(initialFormData);
        setErrorsInput({});
      },
      onError: (err: any) => {
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
    <div className="w-full mx-auto p-0 md:p-6 shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              disabled={loading}
              id="title"
              name="title"
              placeholder="Enter product title"
              value={formData.title}
              onChange={handleOnChange}
            />
            {errorsInput.title?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >{`- ${msg}`}</p>
            ))}
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              disabled={loading}
              id="slug"
              name="slug"
              placeholder="procuct-slug"
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
        </div>
        <div>
          <Label>Description</Label>
          <ReactQuill
            readOnly={loading}
            value={formData.description}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                description: value,
              }));
              setErrorsInput({});
            }}
          />
          {errorsInput.description?.map((msg, i) => (
            <p key={i} className="text-rose-500 text-[11px] ml-1 font-semibold">
              {`- ${msg}`}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              disabled={loading}
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleOnChange}
            />
            {errorsInput.price?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >{`- ${msg}`}</p>
            ))}
          </div>
          <div>
            <Label>Category</Label>
            <Select
              disabled={loading}
              name="category_id"
              value={formData.category_id}
              onValueChange={handleSelectChangeCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {loadingCategoriesData ? (
                  <p>Loading...</p>
                ) : (
                  categoriesData.data.map((item: CategoryList) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errorsInput.category_id?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >{`- ${msg}`}</p>
            ))}
          </div>
          {formData.category_id !== "" ? (
            <div>
              <Label>{`Sub Category (optional)`}</Label>
              <Select
                disabled={loading}
                name="subcategory_id"
                value={formData.subcategory_id}
                onValueChange={handleSelectChangeSubCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  {subcategoryData.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorsInput.subcategory_id?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >{`- ${msg}`}</p>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <Label htmlFor="images">Upload Images</Label>
          <Input
            disabled={loading}
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleOnChange}
            className="hidden"
          />
          <Button
            disabled={loading}
            type="button"
            variant="outline"
            className="mt-2 ml-3"
            onClick={() => document.getElementById("images")?.click()}
          >
            {formData.files.length > 0
              ? `Add images (${formData.files.length} selected)`
              : `Choose Images`}
          </Button>
          {errorsInput.files?.map((msg, i) => (
            <p
              key={i}
              className="text-rose-500 text-[11px] ml-1 font-semibold"
            >{`- ${msg}`}</p>
          ))}
          {formData.files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.files.map((file, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 border rounded overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Tombol hapus */}
                  <button
                    type="button"
                    onClick={() => {
                      if (loading) return;
                      setFormData((prev) => ({
                        ...prev,
                        files: prev.files.filter((_, index) => index !== i),
                      }));
                    }}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <Label htmlFor="sizes">Add Sizes product</Label>
            <Select
              disabled={loading}
              name="size_id"
              value={tempSize.size_id}
              onValueChange={(value) => {
                setErrorsInput({});
                setTempSize((prev) => ({ ...prev, size_id: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sizes" />
              </SelectTrigger>
              <SelectContent>
                {loadingSizesData ? (
                  <p>Loading...</p>
                ) : (
                  sizesData.data.map((item: SizeList) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.size}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errorsInput.sizes?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >{`- ${msg}`}</p>
            ))}
          </div>
          {tempSize.size_id !== "" ? (
            <div className="flex gap-x-4 items-center">
              <div>
                <Label htmlFor="stock">Add Stock</Label>
                <div className="flex gap-x-4 items-center">
                  <Input
                    disabled={loading}
                    type="number"
                    id="stock"
                    name="stock"
                    value={tempSize.stock}
                    onChange={(e) => {
                      setErrorsInput({});
                      setTempSize((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }));
                    }}
                  />
                  <Hint asChild label="Add size & stock" side="right">
                    <Button type="button" onClick={handleAddSize}>
                      +
                    </Button>
                  </Hint>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div>
          {formData.sizes.length > 0 && (
            <div>
              <Label className="mb-2">Sizes and stock list</Label>
              {formData.sizes.map((s) => {
                const sizeName = sizesData?.data.find(
                  (item: SizeList) => item.id === s.size_id
                )?.size;
                return (
                  <div
                    key={s.size_id}
                    className="flex items-center justify-between border p-2 rounded"
                  >
                    <span className="text-sm font-medium">
                      Size: {sizeName} - Stock: {s.stock}
                    </span>
                    <Button
                      disabled={loading}
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveSize(s.size_id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            disabled={loading}
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({
                ...prev,
                is_active: checked === true,
              }));
            }}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <Button disabled={loading} type="submit" className="max-w-3xl">
          Save Product
          {loading ? <Loader2 className="animate-spin" /> : null}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
