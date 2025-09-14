"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useProducts } from "@/hooks/useProducts";
import { updateSizeProductValidation } from "@/lib/validations/validationSchema";
import { validationResponses } from "@/lib/validations";
import { buildErrorMap } from "@/lib/errorMap";
import { showToastError } from "@/lib/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UpdateSizeAndStockDialogProps = {
  trigger: React.ReactNode;
  sizes: {
    id: string;
    size: string;
  }[];
  loadingSizesData: boolean;
  productSizeId: string;
  defaultSizeId?: string;
  defaultStock?: string;
};

const UpdateSizeAndStock = ({
  trigger,
  sizes,
  loadingSizesData,
  productSizeId,
  defaultSizeId,
  defaultStock,
}: UpdateSizeAndStockDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const initialFormData = {
    size_id: defaultSizeId || "",
    stock: defaultStock || "",
  };
  const [formData, setFormData] = React.useState(initialFormData);
  const [errorsInput, setErrorsInput] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});

  const { updateSizeProduct } = useProducts();
  const handleUpdateSize = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: productSizeId,
      size_id: formData.size_id,
      stock: Number(formData.stock),
    };
    const errorsValidationFront =
      updateSizeProductValidation.safeParse(payload);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrorsInput(buildErrorMap<keyof typeof formData>(errorsFront));
      showToastError("Validation failed");
      return;
    }

    await updateSizeProduct.mutateAsync(payload, {
      onSuccess: () => {
        setErrorsInput({});
        setOpen(false);
      },
      onError: (err: any) => {
        if (err.details && Array.isArray(err.details)) {
          setErrorsInput(buildErrorMap<keyof typeof formData>(err.details));
        }
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setFormData(() => ({
            size_id: defaultSizeId || "",
            stock: defaultStock || "",
          }));
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdateSize}>
          <DialogHeader>
            <DialogTitle>Edit Size and Stock</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 mt-5">
            <div className="grid gap-3">
              <Label htmlFor="size_id">Size</Label>
              <Select
                name="size_id"
                value={formData.size_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, size_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {loadingSizesData ? (
                    <p>Loading...</p>
                  ) : (
                    sizes.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.size}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {errorsInput.size_id?.map((msg, i) => (
              <p
                key={i}
                className="text-rose-500 text-[11px] ml-1 font-semibold"
              >
                {`- ${msg}`}
              </p>
            ))}

            <div className="grid gap-3">
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
                }
              />
            </div>
          </div>
          {errorsInput.stock?.map((msg, i) => (
            <p key={i} className="text-rose-500 text-[11px] ml-1 font-semibold">
              {`- ${msg}`}
            </p>
          ))}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="mb-3 md:mb-0">
              {`Save changes`}
              <Loader2
                className={cn(
                  "animate-spin",
                  !updateSizeProduct.isPending && "hidden"
                )}
              />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSizeAndStock;
