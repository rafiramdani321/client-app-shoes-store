"use client";

import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { CreateProductType } from "@/types/dashboad.admin.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useProducts() {
  const queryClient = useQueryClient();

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

  return { addProduct };
}
