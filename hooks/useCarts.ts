"use client";

import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { CreateCartType } from "@/types/cart.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCarts() {
  const queryClient = useQueryClient();

  const useGetCartsByUser = (isLoggedIn: boolean) => {
    return useQuery({
      queryKey: ["carts"],
      queryFn: async () => {
        const res = await apiFetch(`/carts`, { method: "GET" });
        const results = await res.json();
        if (!res.ok) {
          throw results;
        }
        return results.data;
      },
      retry: false,
      enabled: isLoggedIn,
    });
  };

  const addCart = useMutation({
    mutationFn: async (data: CreateCartType) => {
      const res = await apiFetch(`/carts`, {
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
      showToastSuccess(results.message || "Add cart success");
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Add cart failed");
      throw error;
    },
  });

  return {
    useGetCartsByUser,
    addCart,
  };
}
