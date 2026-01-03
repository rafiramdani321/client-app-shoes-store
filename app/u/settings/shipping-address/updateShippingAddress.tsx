"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useShippingAddress } from "@/hooks/useShippingAddress";
import { createOrUpdateShippingAddressValidation } from "@/lib/validations/validationSchema";
import { buildErrorMap } from "@/lib/errorMap";
import { showToastError } from "@/lib/toast";
import { validationResponses } from "@/lib/validations";

interface UpdateShippingAddressProps {
  id: string;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateShippingAddress = ({
  id,
  openDialog,
  setOpenDialog,
}: UpdateShippingAddressProps) => {
  const { useGetShippingAddressById, updateShippingAddress } =
    useShippingAddress();

  const { data, isLoading } = useGetShippingAddressById(id);

  const initialValue = {
    recipent_name: "",
    label_address: "",
    phone_number_recipent: "",
    address: "",
    province_name: "",
    city_name: "",
    postal_code: "",
    is_primary: false,
  };

  const [formData, setFormData] = React.useState(initialValue);
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (data) {
      setFormData({
        recipent_name: data.recipent_name,
        phone_number_recipent: data.phone_number_recipent,
        label_address: data.label_address,
        address: data.address,
        city_name: data.city_name,
        province_name: data.province_name,
        postal_code: data.postal_code,
        is_primary: data.is_primary,
      });
    }
  }, [data]);

  React.useEffect(() => {
    if (!openDialog) {
      setFormData(initialValue);
      setErrorsInput({});
      setMessage("");
    }
  }, [openDialog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorsInput((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    setMessage("");
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorsInput((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    setMessage("");
  };

  const handleChangeCheckbox = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_primary: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorValidationFront =
      createOrUpdateShippingAddressValidation.safeParse(formData);
    if (!errorValidationFront.success) {
      const error = validationResponses(errorValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(error));
      showToastError("Validation failed.");
      return;
    }

    const payload = {
      id,
      ...formData,
    };

    await updateShippingAddress.mutateAsync(payload, {
      onSuccess: () => {
        setErrorsInput({});
        setMessage("");
        setOpenDialog(false);
      },
      onError: (error: any) => {
        if (error.details && Array.isArray(error.details)) {
          setErrorsInput(buildErrorMap<keyof typeof formData>(error.details));
        } else {
          setMessage(error.message || "Someting went wrong.");
        }
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">
            Update Shipping Address
          </DialogTitle>
          <DialogDescription className="hidden">
            Update Shipping Address
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {updateShippingAddress.isError && message && (
            <p className="font-semibold text-sm text-red-500">{message}</p>
          )}
          <div className="flex gap-x-2">
            <div className="w-full">
              <Label htmlFor="recipent_name">Recipent Name</Label>
              <Input
                type="text"
                name="recipent_name"
                id="recipent_name"
                placeholder="Recipent name"
                value={formData.recipent_name}
                onChange={handleChange}
              />
              {errorsInput.recipent_name?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >
                  {`-${msg}`}
                </p>
              ))}
            </div>
            <div className="w-full">
              <Label htmlFor="phone_number_recipent">Phone Number</Label>
              <Input
                type="text"
                name="phone_number_recipent"
                id="phone_number_recipent"
                placeholder="Phone number recipent"
                value={formData.phone_number_recipent}
                onChange={handleChange}
              />
              {errorsInput.phone_number_recipent?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >
                  {`-${msg}`}
                </p>
              ))}
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-full">
              <Label htmlFor="province_name">Province</Label>
              <Input
                type="text"
                name="province_name"
                id="province_name"
                placeholder="Province"
                value={formData.province_name}
                onChange={handleChange}
              />
              {errorsInput.province_name?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >
                  {`-${msg}`}
                </p>
              ))}
            </div>
            <div className="w-full">
              <Label htmlFor="city_name">City</Label>
              <Input
                type="text"
                name="city_name"
                id="city_name"
                placeholder="City"
                value={formData.city_name}
                onChange={handleChange}
              />
              {errorsInput.city_name?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >
                  {`-${msg}`}
                </p>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              name="address"
              id="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChangeTextArea}
            />
            {errorsInput.address?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >
                {`-${msg}`}
              </p>
            ))}
          </div>
          <div className="flex gap-x-5 items-center">
            <div>
              <Label htmlFor="label_address">Label Address</Label>
              <Input
                type="text"
                name="label_address"
                id="label_address"
                placeholder="Home"
                value={formData.label_address}
                onChange={handleChange}
              />
              {errorsInput.label_address?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >
                  {`-${msg}`}
                </p>
              ))}
            </div>
            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                type="text"
                name="postal_code"
                id="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
              {errorsInput.postal_code?.map((msg, i) => (
                <p
                  key={i}
                  className="text-rose-500 text-[11px] ml-1 font-semibold"
                >
                  {`-${msg}`}
                </p>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-5">
            <div className="flex gap-x-2 items-center">
              <Checkbox
                name="is_primary"
                id="is_primary"
                checked={formData.is_primary}
                onCheckedChange={(checked) => {
                  handleChangeCheckbox(Boolean(checked));
                }}
                disabled={isLoading || updateShippingAddress.isPending}
              />
              <Label htmlFor="is_primary">Is Primary</Label>
            </div>
            <div className="flex gap-x-3">
              <Button type="submit" variant="default">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                disabled={isLoading || updateShippingAddress.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateShippingAddress;
