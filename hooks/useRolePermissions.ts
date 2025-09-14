"use client";

import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  RolePermissionCreateType,
  RolePermissionQueryParams,
  RolePermissionUpdateType,
} from "@/types/dashboad.admin.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRolePermissions() {
  const queryClient = useQueryClient();

  const useGetRolePermissions = (params: RolePermissionQueryParams) => {
    return useQuery({
      queryKey: [
        "role-permissions",
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.search,
      ],
      queryFn: async () => {
        const qs = new URLSearchParams();
        (
          Object.entries(params) as [keyof RolePermissionQueryParams, any][]
        ).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "")
            qs.append(String(k), String(v));
        });
        const res = await apiFetch(`/roles/role-permissions?${qs.toString()}`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed fetch role permissions");
        return data.data;
      },
    });
  };

  const useGetRolePermissionById = (id: string) => {
    return useQuery({
      queryKey: ["role-permissions", id],
      queryFn: async () => {
        const res = await apiFetch(`/roles/role-permissions/${id}`, {
          method: "GET",
        });
        const results = await res.json();
        if (!res.ok) {
          showToastError(results.error);
          throw new Error(results.error || "Failed get role permission by id");
        }
        return results;
      },
      enabled: !!id,
      retry: false,
    });
  };

  const useAddRolePermission = useMutation({
    mutationFn: async (data: RolePermissionCreateType) => {
      const res = await apiFetch(`/roles/role-permissions`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const results = await res.json();
      if (!res.ok) {
        throw {
          message:
            results.message || results.error || "Failed add role permission",
          details: results.errors || null,
        };
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Add role permission success");
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
    },
  });

  const useUpdateRolePermission = useMutation({
    mutationFn: async (data: RolePermissionUpdateType) => {
      const res = await apiFetch(`/roles/role-permissions/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const results = await res.json();
      if (!res.ok) {
        throw {
          message:
            results.message || results.error || "Failed add role permission",
          details: results.errors || null,
        };
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message || "Update role permission success");
      queryClient.invalidateQueries({ queryKey: ["role-permission"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed");
    },
  });

  const useDeleteRolePermission = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/roles/role-permissions/${id}`, {
        method: "DELETE",
      });
      const results = await res.json();
      if (!res.ok) {
        throw results;
      }
      return results;
    },
    onSuccess: (results) => {
      showToastSuccess(results.message);
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed delete role permission");
    },
  });

  const useDeleteManyRolePermission = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await apiFetch(`/roles/role-permissions/delete-many`, {
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
      showToastSuccess(results.message);
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed delete many role permission");
    },
  });

  return {
    useGetRolePermissions,
    useGetRolePermissionById,
    useAddRolePermission,
    useUpdateRolePermission,
    useDeleteRolePermission,
    useDeleteManyRolePermission,
  };
}
