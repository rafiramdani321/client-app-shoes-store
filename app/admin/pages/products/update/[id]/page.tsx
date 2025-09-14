"use client";

import React from "react";
import dynamic from "next/dynamic";
import slugify from "slugify";
import { Loader2, SquarePen, Trash } from "lucide-react";
import "react-quill/dist/quill.snow.css";

import { Hint } from "@/components/hint";
import { useSizes } from "@/hooks/useSizes";
import { useCategories } from "@/hooks/useCategories";
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
import { useParams, useRouter } from "next/navigation";
import DialogDelete from "@/components/dialog-delete";
import { Separator } from "@/components/ui/separator";
import UpdateSizeAndStock from "../../_components/update-size-dialog";
import { updateProductValidation } from "@/lib/validations/validationSchema";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";

type ProductImage = {
  id: string;
  url: string;
  fileId: string;
};

type SizeForm = {
  id: string;
  size_id: string;
  stock: string;
};

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const UpdateProduct = () => {
  const { id } = useParams();
  const router = useRouter();
  const productId = Array.isArray(id) ? id[0] : id;

  const {
    useGetProductById,
    useDeleteImageProductById,
    useAddImageProductByProductId,
    addSizeProduct,
    useDeleteSizeProductById,
    updateProductById,
  } = useProducts();
  const { useGetCategories } = useCategories();
  const { useGetSizes } = useSizes();
  const { data: sizesData, isLoading: loadingSizesData } = useGetSizes({
    limit: undefined,
  });
  const {
    data: product,
    isLoading: loadingProduct,
    isError: isErrorProductById,
  } = useGetProductById(productId || "");
  const { data: categoriesData, isLoading: loadingCategories } =
    useGetCategories({
      limit: undefined,
      sortBy: "created_at",
      sortOrder: "asc",
    });

  const initialFormData = {
    title: "",
    slug: "",
    description: "",
    price: "",
    category_id: "",
    subcategory_id: "",
    files: [] as ProductImage[],
    sizes: [] as SizeForm[],
    is_active: false,
  };

  const [formData, setFormData] = React.useState(initialFormData);
  const [loading, setLoading] = React.useState(false);
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [subCategories, setSubCategories] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [tempSize, setTempSize] = React.useState<SizeForm>({
    id: "",
    size_id: "",
    stock: "",
  });
  const [newSizes, setNewSizes] = React.useState<SizeForm[]>([]);

  React.useEffect(() => {
    if (product && categoriesData && sizesData) {
      setFormData({
        title: product.data.title,
        slug: product.data.slug,
        description: product.data.description,
        price: product.data.price,
        category_id: product.data.category_id,
        subcategory_id: product.data.subcategory_id,
        files: product.data.ProductImage,
        sizes: product.data.ProductSize,
        is_active: product.data.is_active,
      });
    }
  }, [product, categoriesData, sizesData]);

  React.useEffect(() => {
    if (product && formData.category_id !== "") {
      const fetchCategoryById = async () => {
        const res = await CategoriesSerive.getCategoryById(
          formData.category_id
        );
        setSubCategories(res.SubCategory);
      };
      fetchCategoryById();
    }
  }, [product, formData.category_id]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files) {
      const data = Array.from(files);
      if (formData.files.length + data.length + newFiles.length > 5) {
        showToastError("You can only upload up to 5 images");
        return;
      }
      setNewFiles((prev) => [...prev, ...data]);
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

  const handleUploadNewImages = async () => {
    setLoading(true);
    const payload = {
      product_id: productId,
      files: newFiles,
    };

    await useAddImageProductByProductId.mutateAsync(payload, {
      onSuccess: () => {
        setNewFiles([]);
        setErrorsInput({});
      },
      onSettled: () => setLoading(false),
    });
  };

  const handleDeleteImageProduct = async (id: string) => {
    if (!id || id == "") {
      showToastError("Something went wrong");
    }
    await useDeleteImageProductById.mutateAsync(id);
  };

  const handleAddTempSizesAndStock = () => {
    setErrorsInput({});
    if (!tempSize.size_id || !tempSize.stock) {
      showToastError("size and stock is required.");
      return;
    }
    const sizeExist = formData.sizes.find(
      (s) => s.size_id === tempSize.size_id
    );
    if (sizeExist) {
      showToastError(`Size already exist`);
      return;
    }
    setNewSizes((prev) => [...prev, tempSize]);
    setTempSize({ id: "", size_id: "", stock: "" });
  };

  const handleAddNewSizeAndStock = async () => {
    setLoading(true);
    const payload = {
      product_id: productId,
      sizes: newSizes.map((s) => ({
        ...s,
        stock: Number(s.stock),
      })),
    };

    await addSizeProduct.mutateAsync(payload, {
      onSuccess: () => {
        setNewSizes([]);
        setTempSize({ id: "", size_id: "", stock: "" });
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  const handleDeleteSizeAndStock = async (id: string) => {
    if (!id) return;
    await useDeleteSizeProductById.mutateAsync(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      id: productId,
      title: formData.title,
      slug: slugify(formData.slug, { lower: true }),
      description: formData.description,
      price: formData.price,
      category_id: formData.category_id,
      subcategory_id: formData.subcategory_id,
      is_active: formData.is_active,
    };
    const errorValidationFront = updateProductValidation.safeParse(payload);
    if (!errorValidationFront.success) {
      const errorsFront = validationResponses(errorValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof payload>(errorsFront));
      showToastError("Validation failed");
      setLoading(false);
      return;
    }

    await updateProductById.mutateAsync(payload, {
      onSuccess: () => {
        setErrorsInput({});
      },
      onError: (err: any) => {
        if (err.details && Array.isArray(err.details)) {
          setErrorsInput(buildErrorMap<keyof typeof payload>(err.details));
        }
      },
      onSettled: () => setLoading(false),
    });
  };

  React.useEffect(() => {
    if (isErrorProductById) {
      router.replace("/admin/pages/products/list");
    }
  }, [isErrorProductById, router]);

  if (loadingProduct || loadingCategories) return <p>Loading...</p>;
  if (isErrorProductById) return null;

  return (
    <>
      <div className="w-full mx-auto p-0 md:p-6 shadow rounded-2xl">
        <h2 className="text-xl font-semibold mb-6">Update Product</h2>
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
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >
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
                key={formData.category_id || "no-category"}
                name="category_id"
                value={formData.category_id || ""}
                onValueChange={handleSelectChangeCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategories ? (
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
            <div>
              <Label>{`Sub Category (optional)`}</Label>
              <Select
                disabled={loading}
                key={formData.subcategory_id || "no_subcategory"}
                name="subcategory_id"
                value={formData.subcategory_id || ""}
                onValueChange={handleSelectChangeSubCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((item) => (
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
          </div>

          <div>
            <Label>Images</Label>
            {formData.files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.files.map((file, i) => (
                  <div
                    key={file.id}
                    className="relative w-20 h-20 border rounded overflow-hidden group"
                  >
                    <img
                      src={file.url}
                      alt={file.url}
                      className="w-full h-full object-cover"
                    />
                    <DialogDelete
                      trigger={
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          X
                        </button>
                      }
                      onConfirm={() => handleDeleteImageProduct(file.id)}
                      title="Delete image?"
                      description="This will permanently delete the image from the product."
                      loading={useDeleteImageProductById.isPending}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Add new images</Label>
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
              {newFiles.length > 0
                ? `Add images (${newFiles.length} selected)`
                : `Choose Images`}
            </Button>
            {errorsInput.files?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >{`- ${msg}`}</p>
            ))}
            {newFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newFiles.map((file, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 border rounded overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (loading) return;
                        setNewFiles((prev) =>
                          prev.filter((_, index) => index !== i)
                        );
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
          {newFiles.length > 0 ? (
            <Button
              disabled={loading}
              onClick={() => handleUploadNewImages()}
              type="button"
              variant="outline"
            >
              Upload new images
            </Button>
          ) : null}

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
                      className="flex items-center justify-between border p-2 rounded-sm"
                    >
                      <span className="text-sm font-medium">
                        Size: {sizeName} - Stock: {s.stock}
                      </span>
                      <div className="flex items-center">
                        <UpdateSizeAndStock
                          trigger={
                            <button
                              disabled={loading}
                              type="button"
                              className="text-blue-500 bg-blue-200 p-1 rounded-md"
                            >
                              <SquarePen className="h-5 w-5" />
                            </button>
                          }
                          sizes={sizesData.data ?? []}
                          loadingSizesData={loadingSizesData}
                          defaultSizeId={s.size_id}
                          defaultStock={s.stock}
                          productSizeId={s.id}
                        />
                        <Separator className="w-7 rotate-90" />
                        <DialogDelete
                          trigger={
                            <button
                              disabled={loading}
                              type="button"
                              className="text-red-500 bg-red-200 p-1 rounded-md"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          }
                          onConfirm={() => handleDeleteSizeAndStock(s.id)}
                          title="Delete size and stock?"
                          description="This will permanently delete the size and stock the product"
                          loading={useDeleteSizeProductById.isPending}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <Label>Add Size and Stock</Label>
              <Select
                disabled={loading}
                name={"size_id"}
                value={tempSize.size_id}
                onValueChange={(value) => {
                  setErrorsInput({});
                  setTempSize((prev) => ({ ...prev, size_id: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
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
                >
                  {`- ${msg}`}
                </p>
              ))}
            </div>
            {tempSize.size_id !== "" ? (
              <div className="flex gap-x-4 items-center">
                <div>
                  <Label>Add Stock</Label>
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
                      <Button
                        type="button"
                        onClick={() => handleAddTempSizesAndStock()}
                      >
                        +
                      </Button>
                    </Hint>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            {newSizes.length > 0 && (
              <div>
                <Label className="mb-2">New Sizes and stock</Label>
                {newSizes.map((s, i) => {
                  const sizeName = sizesData?.data.find(
                    (item: SizeList) => item.id === s.size_id
                  )?.size;
                  return (
                    <div
                      key={s.size_id}
                      className="flex items-center justify-between border py-1 px-2 rounded-sm"
                    >
                      <span className="text-sm font-medium">
                        Size: {sizeName} - Stock: {s.stock}
                      </span>
                      <Button
                        disabled={loading}
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setNewSizes((prev) =>
                            prev.filter((_, index) => index !== i)
                          )
                        }
                      >
                        <Trash />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {newSizes.length > 0 ? (
            <Button
              disabled={loading}
              onClick={() => handleAddNewSizeAndStock()}
              type="button"
              variant="outline"
            >
              {`Add new size and stock`}
            </Button>
          ) : null}

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

          <div className="flex justify-end">
            <Button disabled={loading} type="submit" className="max-w-3xl">
              Update Product
              {loading ? <Loader2 className="animate-spin" /> : null}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;
