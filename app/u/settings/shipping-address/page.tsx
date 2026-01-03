"use client";

import React from "react";

import { ShippingAddressProps } from "@/types/shippingAddress.type";
import { useShippingAddress } from "@/hooks/useShippingAddress";
import { Button } from "@/components/ui/button";
import ShippingAddressCard from "./_components/shippingAddressCard";
import { ShippingAddressSkeleton } from "./_components/shippingAddressPageSkeleton";
import AddShippingAddress from "./addShippingAddress";

export default function ShippingAddressPage() {
  const { useGetShippingAddress } = useShippingAddress();

  const [openAddShippingAddress, setOpenAddShippingAddress] =
    React.useState(false);

  const { data: shippingAddresses, isLoading } = useGetShippingAddress();
  const data: ShippingAddressProps[] = shippingAddresses?.data ?? [];

  return (
    <>
      <AddShippingAddress
        openDialog={openAddShippingAddress}
        setOpenDialog={setOpenAddShippingAddress}
      />
      <div className="w-full h-[50vh]">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenAddShippingAddress(true)}
        >
          + New Address
        </Button>
        <div className="mt-3 space-y-3">
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <ShippingAddressSkeleton key={i} />
              ))}
            </>
          )}

          {!isLoading && data.length === 0 && (
            <div className="w-full border rounded-md p-6 text-center text-sm text-muted-foreground">
              Shipping address not found.
            </div>
          )}

          {!isLoading &&
            data.length > 0 &&
            data.map((s) => (
              <div className="w-full border rounded-md shadow-sm" key={s.id}>
                <ShippingAddressCard
                  id={s.id}
                  recipent_name={s.recipent_name}
                  phone_number_recipent={s.phone_number_recipent}
                  address={s.address}
                  label_address={s.label_address}
                  is_primary={s.is_primary}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
