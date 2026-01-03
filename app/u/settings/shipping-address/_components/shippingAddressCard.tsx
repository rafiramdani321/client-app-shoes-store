"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShippingAddressProps } from "@/types/shippingAddress.type";
import DeleteDialog from "@/components/delete-dialog";
import { useShippingAddress } from "@/hooks/useShippingAddress";
import { cn } from "@/lib/utils";
import UpdateShippingAddress from "../updateShippingAddress";

const ShippingAddressCard = ({
  id,
  recipent_name,
  label_address,
  phone_number_recipent,
  address,
  is_primary,
}: ShippingAddressProps) => {
  const { deleteShippingAddress, setPrimaryToTrue } = useShippingAddress();
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [openUpdateShippingAddress, setOpenUpdateShippingAddress] =
    React.useState(false);

  const handleSetPrimary = async () => {
    if (is_primary) return;
    await setPrimaryToTrue.mutateAsync(id);
  };

  return (
    <>
      <DeleteDialog
        id={id}
        title="This address"
        onDelete={(id) => deleteShippingAddress.mutateAsync(id)}
        openDialog={openDialogDelete}
        setOpenDialog={setOpenDialogDelete}
      />
      {openUpdateShippingAddress && (
        <UpdateShippingAddress
          id={id}
          openDialog={openUpdateShippingAddress}
          setOpenDialog={setOpenUpdateShippingAddress}
        />
      )}
      <div className="p-3">
        <div className="flex justify-between">
          <div className="w-[70%]">
            <div className="flex items-center">
              <h3 className="text-sm font-semibold">{recipent_name}</h3>
              <Separator className="rotate-90 w-5 text-primary-foreground" />
              <h3 className="text-sm">{phone_number_recipent}</h3>
            </div>
            <div className="mt-1">
              <h3 className="text-sm capitalize">- {label_address}</h3>
              <p className="line-clamp-3 text-primary text-sm mt-1">
                {address}
              </p>
            </div>
          </div>
          <div>
            <div className="flex gap-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpenUpdateShippingAddress(true)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpenDialogDelete(true)}
                disabled={
                  deleteShippingAddress.isPending || setPrimaryToTrue.isPending
                }
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <Checkbox
            id={`primary-${id}`}
            checked={is_primary}
            className={cn(
              !is_primary ? "cursor-pointer" : "cursor-not-allowed"
            )}
            disabled={is_primary || setPrimaryToTrue.isPending}
            onClick={handleSetPrimary}
          />
          <Label htmlFor={`primary-${id}`}>Primary</Label>
        </div>
      </div>
    </>
  );
};

export default ShippingAddressCard;
