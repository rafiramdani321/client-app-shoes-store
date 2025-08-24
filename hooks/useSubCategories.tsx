"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import {
  SubcategoryBaseType,
  SubCategoryQueryParams,
  SubcategoryUpdate,
} from "@/types/dashboad.admin.type";
import { showToastError, showToastSuccess } from "@/lib/toast";

export function useSubCategories() {
  const queryClient = useQueryClient();

  const useGetSubCategories = (params: SubCategoryQueryParams) => {
    return useQuery({
      queryKey: [
        "sub-categories",
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.search,
      ],
      queryFn: async () => {
        const qs = new URLSearchParams();
        (
          Object.entries(params) as [keyof SubCategoryQueryParams, any][]
        ).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "")
            qs.append(String(k), String(v));
        });
        const res = await apiFetch(
          `/sub-categories?${qs.toString()}`,
          { method: "GET" },
          { withAuth: false }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed fetch categories");
        return data.data;
      },
    });
  };

  const useGetSubcategoryById = (id: string) => {
    return useQuery({
      queryKey: ["sub-categories", id],
      queryFn: async () => {
        const res = await apiFetch(
          `/sub-categories/${id}`,
          { method: "GET" },
          { withAuth: false }
        );
        const results = await res.json();
        if (!res.ok) {
          throw new Error(results.message || "Failed get sub category by id");
        }
        return results;
      },
      enabled: !!id,
    });
  };

  const useAddSubcategory = useMutation({
    mutationFn: async (data: SubcategoryBaseType) => {
      const res = await apiFetch(`/sub-categories`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const results = await res.json();
      if (!res.ok) {
        throw new Error(results.message || "Failed add sub category");
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Add sub category success");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
      throw error;
    },
  });

  const useUpdateSubcategory = useMutation({
    mutationFn: async (data: SubcategoryUpdate) => {
      const res = await apiFetch(`/sub-categories/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const results = await res.json();
      if (!res.ok) {
        throw new Error(results.message || "Failed update sub category");
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Update sub category success");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
      throw error;
    },
  });

  const useDeleteSubcategoryById = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/sub-categories/${id}`, { method: "DELETE" });
      const results = await res.json();
      if (!res.ok) {
        throw new Error(results.message || "Failed to delete sub category");
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message);
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: () => {
      showToastError("Something went wrong");
    },
  });

  const useDeleteManySubcategories = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiFetch(`/sub-categories/delete-many`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });
      const results = await res.json();
      if (!res.ok) {
        throw new Error(results.message || "Failed delete many sub categories");
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message);
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: () => {
      showToastError("Something went wrong");
    },
  });

  return {
    useGetSubCategories,
    useGetSubcategoryById,
    useAddSubcategory,
    useUpdateSubcategory,
    useDeleteSubcategoryById,
    useDeleteManySubcategories,
  };
}
