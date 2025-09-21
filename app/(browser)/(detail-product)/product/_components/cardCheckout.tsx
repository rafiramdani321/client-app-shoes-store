import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type CardCheckoutProps = {
  size: string;
  quantity: number;
  stock: number;
  loading: boolean;
  handleDecrement: () => void;
  handleIncrement: () => void;
  total_price: string | number;
  handleAddCart: () => void;
};

const CardCheckout = ({
  size,
  quantity,
  stock,
  loading,
  handleDecrement,
  handleIncrement,
  total_price,
  handleAddCart,
}: CardCheckoutProps) => {
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg">Set quantity and notes</h2>
      <h3 className="text-sm mt-5">Size : {size || "-"}</h3>
      <div className="mt-2">
        <h3 className="text-sm">Quantity :</h3>
        <div className="flex items-center gap-x-3">
          <div className="border w-fit bg-background rounded-lg mt-1">
            <div className="flex gap-x-3 py-0.5 px-3 items-center">
              <button
                disabled={quantity <= 1 || loading}
                className={cn(
                  "text-xl font-semibold",
                  quantity <= 1 && "text-muted-foreground"
                )}
                onClick={handleDecrement}
              >
                -
              </button>
              <p className="px-6">{quantity}</p>
              <button
                disabled={quantity === stock || loading}
                className={cn(
                  "text-xl font-semibold",
                  quantity === stock && "text-muted-foreground"
                )}
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>
          <h3 className="text-sm font-semibold">Stock : {stock || "-"}</h3>
        </div>
      </div>
      <div className="mt-6 flex items-center">
        <h3 className="text-base font-semibold text-muted-foreground">
          Sub total :
        </h3>
        <h2 className="text-base font-semibold ml-3">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(Number(total_price))}
        </h2>
      </div>
      <div className="mt-5 flex w-full gap-x-3">
        <Button
          disabled={loading}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleAddCart()}
        >
          + Cart
        </Button>
        <Button disabled={loading} type="button" className="w-full">
          Buy
        </Button>
      </div>
    </div>
  );
};

export default CardCheckout;
