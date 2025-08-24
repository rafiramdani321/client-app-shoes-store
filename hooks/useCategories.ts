"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  CategoryBaseType,
  CategoryUpdate,
  CategoryQueryParams,
} from "@/types/dashboad.admin.type";

export function useCategories() {
  const queryClient = useQueryClient();

  const useGetCategories = (params: CategoryQueryParams) => {
    return useQuery({
      queryKey: [
        "categories",
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.search,
      ],
      queryFn: async () => {
        const qs = new URLSearchParams();
        (Object.entries(params) as [keyof CategoryQueryParams, any][]).forEach(
          ([k, v]) => {
            if (v !== undefined && v !== null && v !== "")
              qs.append(String(k), String(v));
          }
        );
        const res = await apiFetch(
          `/categories?${qs.toString()}`,
          { method: "GET" },
          { withAuth: false }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed fetch categories");
        return data.data;
      },
    });
  };

  const getCategoyById = (id: string) => {
    return useQuery({
      queryKey: ["category", id],
      queryFn: async () => {
        const res = await apiFetch(
          `/categories/${id}`,
          { method: "GET" },
          { withAuth: false }
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed fetch category by id");
        return data.data;
      },
      enabled: !!id,
    });
  };

  const addCategory = useMutation({
    mutationFn: async (data: CategoryBaseType) => {
      const res = await apiFetch(`/categories`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const results = await res.json();

      if (!res.ok) {
        throw results;
      }

      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Add category success");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
      throw error;
    },
  });

  const updateCategory = useMutation({
    mutationFn: async (data: CategoryUpdate) => {
      const res = await apiFetch(`/categories/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const results = await res.json();
      if (!res.ok) throw results;
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Update category success");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
      throw error;
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/categories/${id}`, { method: "DELETE" });
      const results = await res.json();
      if (!res.ok)
        throw new Error(results.message || "Failed to delete category");
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      showToastError("Something went wrong");
    },
  });

  const deleteManyCategory = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiFetch(`/categories/delete-many`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });

      const results = await res.json();
      if (!res.ok)
        throw new Error(results.message || "Failed to delete categories");
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      showToastError("Something went wrong");
    },
  });

  return {
    useGetCategories,
    deleteCategory,
    deleteManyCategory,
    addCategory,
    getCategoyById,
    updateCategory,
  };
}
