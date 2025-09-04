"use client";

import React from "react";
import slugify from "slugify";
import { cn } from "@/lib/utils";

import { useCategories } from "@/hooks/useCategories";
import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import {
  addOrUpdateSubCategoryValidation,
  createOrUpdateRolePermission,
} from "@/lib/validations/validationSchema";
import { useSubCategories } from "@/hooks/useSubCategories";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryList } from "@/types/dashboad.admin.type";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useRoles } from "@/hooks/useRoles";

const UpdateRolePermission = () => {
  const { id } = useParams();
  const router = useRouter();
  const rolePermissionId = Array.isArray(id) ? id[0] : id;

  const { useGetRolePermissionById, useUpdateRolePermission } =
    useRolePermissions();
  const { useGetRoles, useGetPermissions } = useRoles();
  const { data: dataRoles, isLoading: loadingRoles } = useGetRoles({
    limit: undefined,
  });
  const { data: dataPermissions, isLoading: loadingPermission } =
    useGetPermissions({ limit: undefined });

  const [formData, setFormData] = React.useState({
    role_id: "",
    permission_id: "",
  });
  const [error, setError] = React.useState("");
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);

  const inputRef = React.useRef<{
    role_id: HTMLInputElement | null;
    permission_id: HTMLInputElement | null;
  }>({
    role_id: null,
    permission_id: null,
  });

  React.useEffect(() => {
    if (!autoFocus) return;
    if (errorsInput.role_id && inputRef.current.role_id) {
      inputRef.current.role_id.focus();
    } else if (errorsInput.permission_id && inputRef.current.permission_id) {
      inputRef.current.permission_id.focus();
    }
    setAutoFocus(false);
  }, [errorsInput, autoFocus]);

  const {
    data: rolePermision,
    isLoading: loadingRolePermission,
    error: errorRolePermission,
  } = useGetRolePermissionById(rolePermissionId || "");

  React.useEffect(() => {
    if (rolePermision) {
      setFormData({
        role_id: rolePermision.data.role_id,
        permission_id: rolePermision.data.permission_id,
      });
    }
  }, [rolePermision]);

  const handleRoleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role_id: value,
    }));
    setErrorsInput({});
  };

  const handlePermissionSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      permission_id: value,
    }));
    setErrorsInput({});
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validasi frontend
    const errorsValidationFront =
      createOrUpdateRolePermission.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      showToastError("Validation failed.");
      setLoading(false);
      return;
    }

    await useUpdateRolePermission.mutateAsync(
      { id: rolePermissionId!, ...formData },
      {
        onSuccess: () => {
          router.replace("/admin/role-management/role-permission/list");
        },
        onError: (err: any) => {
          setAutoFocus(true);
          if (err.details && Array.isArray(err.details)) {
            setErrorsInput(buildErrorMap<keyof typeof formData>(err.details));
          } else {
            setError(err.message);
          }
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  if (loadingRolePermission) return <p>Loading...</p>;
  if (errorRolePermission) return <p>Error loading role permission</p>;

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Update Role permission</h1>
      <div className="max-w-full xl:max-w-xl mt-5">
        {error !== "" && (
          <div className="mb-3">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="slug">Role</Label>
              {!loadingRoles && (
                <Select
                  key={formData.role_id}
                  value={formData.role_id || undefined}
                  onValueChange={handleRoleSelectChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      {dataRoles?.data?.map((item: CategoryList) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              {errorsInput.role_id?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >{`- ${msg}`}</p>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Role</Label>
              {!loadingPermission && (
                <Select
                  key={formData.permission_id}
                  value={formData.permission_id || undefined}
                  onValueChange={handlePermissionSelectChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Permissions</SelectLabel>
                      {dataPermissions?.data?.map((item: CategoryList) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              {errorsInput.permission_id?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >{`- ${msg}`}</p>
              ))}
            </div>
            <div className="grid gap-2 mt-3">
              <Button disabled={loading}>Save</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRolePermission;
