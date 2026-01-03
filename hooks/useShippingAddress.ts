import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  CreateShippingAddress,
  UpdateShippingAddress,
} from "@/types/shippingAddress.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useShippingAddress() {
  const queryClient = useQueryClient();

  const useGetShippingAddress = () => {
    return useQuery({
      queryKey: ["shipping-address"],
      queryFn: async () => {
        const res = await apiFetch("/shipping-address", { method: "GET" });
        const results = await res.json();
        if (!res.ok) {
          throw results;
        }
        return results;
      },
      retry: false,
    });
  };

  const useGetShippingAddressById = (id: string) => {
    return useQuery({
      queryKey: ["shipping-address", id],
      queryFn: async () => {
        const res = await apiFetch(`/shipping-address/${id}`, {
          method: "GET",
        });
        const result = await res.json();
        if (!res.ok) {
          throw result;
        }
        return result.data as CreateShippingAddress;
      },
      retry: false,
    });
  };

  const addShippingAddress = useMutation({
    mutationFn: async (data: CreateShippingAddress) => {
      const res = await apiFetch("/shipping-address", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(result.message || "Add shipping address success.");
      queryClient.invalidateQueries({ queryKey: ["shipping-address"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed.");
      throw error;
    },
  });

  const deleteShippingAddress = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/shipping-address/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(result.message || "Address successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["shipping-address"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Address failed to delete");
      throw error;
    },
  });

  const updateShippingAddress = useMutation({
    mutationFn: async (data: UpdateShippingAddress) => {
      const res = await apiFetch(`/shipping-address/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(result.message || "Update successfully.");
      queryClient.invalidateQueries({ queryKey: ["shipping-address"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed to update address.");
      throw error;
    },
  });

  const setPrimaryToTrue = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/shipping-address/${id}/set-primary`, {
        method: "PATCH",
      });
      const result = await res.json();
      if (!res.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(
        result.message || "Primary address updated successfully."
      );
      queryClient.invalidateQueries({ queryKey: ["shipping-address"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Something went wrong.");
      throw error;
    },
  });

  return {
    useGetShippingAddress,
    useGetShippingAddressById,
    addShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
    setPrimaryToTrue,
  };
}
