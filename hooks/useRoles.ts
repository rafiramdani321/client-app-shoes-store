"use client";

import { apiFetch } from "@/lib/api";
import {
  PermissionsQueryParams,
  RoleQueryParams,
} from "@/types/dashboad.admin.type";
import { useQuery } from "@tanstack/react-query";

export function useRoles() {
  const useGetRoles = (params: RoleQueryParams) => {
    return useQuery({
      queryKey: ["roles", params],
      queryFn: async () => {
        const qs = new URLSearchParams();
        (Object.entries(params) as [keyof RoleQueryParams, any][]).forEach(
          ([k, v]) => {
            if (v !== undefined && v !== null && v !== "")
              qs.append(String(k), String(v));
          }
        );
        const res = await apiFetch(`/roles?${qs.toString()}`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed fetch roles");
        return data.data;
      },
    });
  };

  const useGetPermissions = (params: PermissionsQueryParams) => {
    return useQuery({
      queryKey: [
        "permissions",
        params.page,
        params.limit,
        params.sortBy,
        params.sortOrder,
        params.search,
      ],
      queryFn: async () => {
        const qs = new URLSearchParams();
        (
          Object.entries(params) as [keyof PermissionsQueryParams, any][]
        ).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "")
            qs.append(String(k), String(v));
        });
        const res = await apiFetch(`/roles/permissions?${qs.toString()}`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed fetch permissions");
        return data.data;
      },
    });
  };

  return { useGetRoles, useGetPermissions };
}
