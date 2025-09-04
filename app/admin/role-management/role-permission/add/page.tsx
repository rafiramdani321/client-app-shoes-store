"use client";

import React from "react";

import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createOrUpdateRolePermission } from "@/lib/validations/validationSchema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryList, RolesList } from "@/types/dashboad.admin.type";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useRoles } from "@/hooks/useRoles";

const AddRolePermission = () => {
  const { useAddRolePermission } = useRolePermissions();
  const { useGetRoles, useGetPermissions } = useRoles();
  const { data: rolesData, isLoading: loadingRoles } = useGetRoles({
    limit: undefined,
  });
  const { data: permissionsData, isLoading: loadingPermissions } =
    useGetPermissions({ limit: undefined });

  const [formData, setFormData] = React.useState({
    role_id: "",
    permission_id: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [error, setError] = React.useState("");
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});

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

  const handleRolesSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role_id: value,
    }));
    setError("");
    setErrorsInput({});
  };

  const handlePermissionSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      permission_id: value,
    }));
    setError("");
    setErrorsInput({});
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

    await useAddRolePermission.mutateAsync(formData, {
      onSuccess: () => {
        setFormData({ role_id: "", permission_id: "" });
        setErrorsInput({});
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
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Add Role permission</h1>
      <div className="max-w-full xl:max-w-xl mt-5">
        {error !== "" && (
          <div className="mb-3">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="slug">Roles</Label>
              <Select
                value={formData.role_id}
                name="role_id"
                onValueChange={handleRolesSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {loadingRoles ? (
                      <p>Loading...</p>
                    ) : (
                      rolesData.data.map((item: RolesList) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errorsInput.role_id?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >{`- ${msg}`}</p>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Permissions</Label>
              <Select
                value={formData.permission_id}
                name="permission_id"
                onValueChange={handlePermissionSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Permissions</SelectLabel>
                    {loadingPermissions ? (
                      <p>Loading...</p>
                    ) : (
                      permissionsData.data.map((item: CategoryList) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
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

export default AddRolePermission;
