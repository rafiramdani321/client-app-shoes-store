import { apiFetch } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { UpdateMyProfile } from "@/types/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  const queryClient = useQueryClient();

  const useGetMyProfile = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const res = await apiFetch(`/users/me`, { method: "GET" });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Failed get user by id");
        }
        return result;
      },
      retry: false,
    });
  };

  const updateMyProfile = useMutation({
    mutationFn: async (data: UpdateMyProfile) => {
      const res = await apiFetch("/users/update-me", {
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
      showToastSuccess(result.message || "Update profile success");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Validation failed.");
      throw error;
    },
  });

  const updateImageProfile = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await apiFetch("/users/update-me/image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(result.message || "Update image profile success.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed update image profile.");
      throw error;
    },
  });

  const deleteImageProfile = useMutation({
    mutationFn: async () => {
      const response = await apiFetch("/users/image", {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(result.message || "Delete image profile success");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed delete image profile.");
      throw error;
    },
  });

  const updateEmailMe = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiFetch("/users/change-email", {
        method: "PUT",
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(
        result.message || "Please check your mail for activation."
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed update email");
      throw error;
    },
  });

  const setMyPassword = useMutation({
    mutationFn: async (data: { password: string; confirmPassword: string }) => {
      const response = await apiFetch("/users/set-mypassword", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(
        result.message ||
          "Set your password success. You can login manual or with google."
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      showToastError(error.error || "Failed set password.");
      throw error;
    },
  });

  const changeMyPassword = useMutation({
    mutationFn: async (data: {
      oldPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      const response = await apiFetch("/users/change-password", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw result;
      }
      return result;
    },
    onSuccess: (result) => {
      showToastSuccess(
        result.message || "Change password success. Please Login again.",
        "top-right",
        5000
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      showToastError(err.error || "Failed change password.");
      throw err;
    },
  });

  return {
    useGetMyProfile,
    updateMyProfile,
    updateImageProfile,
    deleteImageProfile,
    updateEmailMe,
    setMyPassword,
    changeMyPassword,
  };
}
