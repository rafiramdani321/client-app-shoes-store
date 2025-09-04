"use client";

import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  RoleQueryParams,
  SizeBaseType,
  SizeQueryParams,
  SizeUpdate,
} from "@/types/dashboad.admin.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSizes() {
  const queryClient = useQueryClient();

  const useGetSizes = (params: SizeQueryParams) => {
    return useQuery({
      queryKey: ["sizes", params],
      queryFn: async () => {
        const qs = new URLSearchParams();
        (Object.entries(params) as [keyof RoleQueryParams, any][]).forEach(
          ([k, v]) => {
            if (v !== undefined && v !== null && v !== "")
              qs.append(String(k), String(v));
          }
        );
        const res = await apiFetch(`/sizes?${qs.toString()}`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed fetch sizes");
        return data.data;
      },
    });
  };

  const getSizeById = (id: string) => {
    return useQuery({
      queryKey: ["sizes", id],
      queryFn: async () => {
        const res = await apiFetch(`/sizes/${id}`, { method: "GET" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed fetch size by id");
        }
        return data.data;
      },
      enabled: !!id,
    });
  };

  const addSize = useMutation({
    mutationFn: async (data: SizeBaseType) => {
      const res = await apiFetch(`/sizes`, {
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
      showToastSuccess(results.message || "Add size success");
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
      throw error;
    },
  });

  const updateSize = useMutation({
    mutationFn: async (data: SizeUpdate) => {
      const res = await apiFetch(`/sizes/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const results = await res.json();
      if (!res.ok) throw results;
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Update size success");
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
      throw error;
    },
  });

  const deleteSize = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/sizes/${id}`, { method: "DELETE" });
      const results = await res.json();
      if (!res.ok) throw new Error(results.message || "Failed to delete size");
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message);
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
    onError: () => {
      showToastError("Something went wrong");
    },
  });

  const deleteManySizes = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiFetch(`/sizes/delete-many`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });

      const results = await res.json();
      if (!res.ok) throw new Error(results.message || "Failed to delete sizes");
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message);
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
    onError: () => {
      showToastError("Something went wrong");
    },
  });

  return {
    useGetSizes,
    getSizeById,
    addSize,
    updateSize,
    deleteSize,
    deleteManySizes,
  };
}
