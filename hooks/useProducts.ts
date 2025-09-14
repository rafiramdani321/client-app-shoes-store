"use client";

import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  AddImagesProductType,
  AddProductSizeType,
  CreateProductType,
  ProductQueryParams,
  UpdateProductSizeType,
  UpdateProductType,
} from "@/types/dashboad.admin.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProducts() {
  const queryClient = useQueryClient();

  const useGetProducts = (params: ProductQueryParams) => {
    return useQuery({
      queryKey: [
        "products",
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.search,
      ],
      queryFn: async () => {
        const qs = new URLSearchParams();
        (Object.entries(params) as [keyof ProductQueryParams, any][]).forEach(
          ([k, v]) => {
            if (v !== undefined && v !== null && v !== "")
              qs.append(String(k), String(v));
          }
        );
        const res = await apiFetch(
          `/products?${qs.toString()}`,
          { method: "GET" },
          { withAuth: false }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed fetch products");
        return data.data;
      },
    });
  };

  const useGetProductById = (id: string) => {
    return useQuery({
      queryKey: ["products", id],
      queryFn: async () => {
        const res = await apiFetch(
          `/products/${id}`,
          { method: "GET" },
          { withAuth: false }
        );
        const results = await res.json();
        if (!res.ok) {
          showToastError(results.error);
          throw new Error(results.error || "Failed get product by id");
        }
        return results;
      },
      enabled: !!id,
      retry: false,
    });
  };

  const addProduct = useMutation({
    mutationFn: async (data: CreateProductType) => {
      const formData = new FormData();

      // append field biasa
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("category_id", data.category_id);
      formData.append("subcategory_id", data.subcategory_id || "");
      formData.append("sizes", JSON.stringify(data.sizes));
      formData.append("is_active", data.is_active ? "true" : "false");

      // append files
      data.files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await apiFetch("/products", {
        method: "POST",
        body: formData,
      });

      const results = await res.json();
      if (!res.ok) {
        throw results;
      }

      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Add product success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
      throw error;
    },
  });

  const updateProductById = useMutation({
    mutationFn: async (data: UpdateProductType) => {
      const res = await apiFetch(`/products/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const results = await res.json();
      if (!res.ok) {
        throw results;
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Update product success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
      throw error;
    },
  });

  const useDeleteProductById = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/products/${id}`, { method: "DELETE" });
      const results = await res.json();
      if (!res.ok) {
        throw results;
      }
      return results;
    },
    onSuccess(results) {
      showToastSuccess(results.message || "Delete product success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (results: any) => {
      showToastError(results.error || "Failed delete product");
    },
  });

  const useDeleteManyProducts = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiFetch(`/products/delete-many`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });
      const results = await res.json();
      if (!res.ok) {
        throw results;
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Delete many products success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (results: any) => {
      showToastError(results.error || "Failed delete many product");
    },
  });

  const useAddImageProductByProductId = useMutation({
    mutationFn: async (data: AddImagesProductType) => {
      const formdata = new FormData();
      formdata.append("product_id", data.product_id);

      data.files.forEach((file) => {
        formdata.append("images", file);
      });

      const res = await apiFetch("/products/images", {
        method: "POST",
        body: formdata,
      });
      const results = await res.json();
      if (!res.ok) {
        throw results;
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Add product images success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed add images products");
      throw error;
    },
  });

  const useDeleteImageProductById = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/products/images/${id}`, {
        method: "DELETE",
      });
      const results = await res.json();
      if (!res.ok) {
        throw results;
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Delete image product success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (results: any) => {
      showToastError(results.error || "Failed delete image product");
    },
  });

  const addSizeProduct = useMutation({
    mutationFn: async (payload: AddProductSizeType) => {
      const res = await apiFetch("/products/product-sizes", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const results = await res.json();
      if (!res.ok) {
        throw results;
      }

      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Add sizes product success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed add size product");
    },
  });

  const updateSizeProduct = useMutation({
    mutationFn: async (payload: UpdateProductSizeType) => {
      const res = await apiFetch(`/products/product-sizes/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const results = await res.json();
      if (!res.ok) {
        throw results;
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Update size product success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed to update size product");
    },
  });

  const useDeleteSizeProductById = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/products/product-sizes/${id}`, {
        method: "DELETE",
      });
      const results = await res.json();
      if (!res.ok) {
        throw results;
      }
      return results;
    },
    onSuccess(results) {
      showToastSuccess(results.message || "Delete size product success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (results: any) => {
      showToastError(results.error || "Failed to delete size product");
    },
  });

  return {
    addProduct,
    updateProductById,
    useGetProducts,
    useGetProductById,
    useDeleteProductById,
    useDeleteManyProducts,
    useAddImageProductByProductId,
    useDeleteImageProductById,
    addSizeProduct,
    useDeleteSizeProductById,
    updateSizeProduct,
  };
}
