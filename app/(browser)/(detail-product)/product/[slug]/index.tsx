"use client";

import React from "react";
import createDOMPurify from "dompurify";

import { ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { showToastError } from "@/lib/toast";
import { ProductListType } from "@/types/product.type";
import AppBreadcrumb from "@/components/appBreadcrumb";
import ImagesProduct from "../_components/imageProduct";
import { Button } from "@/components/ui/button";
import ButtonOptions from "../_components/buttonOptions";
import { useRouter } from "next/navigation";
import { useCarts } from "@/hooks/useCarts";
import CardCheckout from "../_components/cardCheckout";

const ProductDetail = ({ product }: { product: ProductListType }) => {
  const DOMPurify = React.useMemo(
    () => (typeof window !== "undefined" ? createDOMPurify(window) : null),
    []
  );

  const { accessToken, user } = useAuthStore((state) => state);
  const router = useRouter();

  const [image, setImage] = React.useState(product.ProductImage[0].url);
  const [openCheckout, setOpenCheckout] = React.useState(false);

  const initialState = {
    product_size: {
      id: "",
      size: "",
      stock: 0,
    },
    quantity: 1,
    total_price: product.price || 0,
  };
  const [state, setState] = React.useState(initialState);
  const [errorsFront, setErrorsFront] = React.useState<{
    field: string;
    message: string;
  }>({
    field: "",
    message: "",
  });
  const [loading, setLoading] = React.useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    {
      label: product.category.name,
      href: `/products/${product.category.slug}`,
    },
    ...(product.sub_category
      ? [
          {
            label: product.sub_category.name,
            href: `/products/${product.category.slug}/${product.sub_category.slug}`,
          },
        ]
      : []),
    { label: product.title },
  ];

  const handleSelectSize = (id: string, size: string, stock: number) => {
    setErrorsFront({ field: "", message: "" });
    setState(initialState);
    setState((prev) => ({
      ...prev,
      product_size: {
        id,
        size,
        stock,
      },
    }));
  };

  const validateSizeSelected = () => {
    if (state.product_size.size === "") {
      showToastError("Please select size");
      setErrorsFront({
        field: "product_size_id",
        message: "Please select size",
      });
      return false;
    }
    return true;
  };

  const handleDecrement = () => {
    if (!validateSizeSelected()) return;
    if (state.quantity <= 1) return;
    setState((prev) => ({
      ...prev,
      quantity: prev.quantity - 1,
      total_price: String(Number(prev.total_price) - Number(product.price)),
    }));
  };

  const handleIncrement = () => {
    if (!validateSizeSelected()) return;
    if (state.quantity === state.product_size.stock) return;
    setState((prev) => ({
      ...prev,
      quantity: prev.quantity + 1,
      total_price: String(Number(prev.total_price) + Number(product.price)),
    }));
  };

  const { addCart } = useCarts();
  const handleAddCart = async () => {
    if (!accessToken || !user) {
      router.replace("/auth/signin");
      return;
    }
    if (!validateSizeSelected()) return;

    if (product.id === "" || state.product_size.id === "") {
      showToastError("Something went wrong");
      return;
    }

    setLoading(true);
    const payload = {
      product_id: product.id,
      product_size_id: state.product_size.id,
      quantity: state.quantity,
      unit_price: Number(product.price),
      total_price: Number(state.total_price),
    };

    await addCart.mutateAsync(payload, {
      onSuccess: () => {
        setState(initialState);
        setErrorsFront({ field: "", message: "" });
        setOpenCheckout(false);
      },
      onError: (err: any) => {
        console.error(err.error);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "w-full px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64 transition-all duration-300",
          openCheckout ? "mb-[25rem]" : "mb-0"
        )}
      >
        <div className={cn("mb-4 hidden md:block")}>
          <AppBreadcrumb items={breadcrumbItems} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[30%_40%_30%] xl:grid-cols-[25%_50%_25%] gap-5">
          <div>
            <ImagesProduct
              image={image}
              images={product.ProductImage}
              setImage={setImage}
            />
          </div>

          {/* Product Info */}
          <div className="mt-2">
            <div className="flex-col md:flex">
              <h1 className="text-xl font-semibold">{product.title}</h1>
              <h2 className="text-base font-semibold mt-2">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Number(product.price))}
              </h2>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                Sizes
              </h3>
              <div className="flex flex-wrap gap-x-2">
                {product.ProductSize.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "border rounded-md mt-2",
                      errorsFront.field === "product_size_id" &&
                        "border-red-500",
                      state.product_size.id === item.id &&
                        "bg-secondary-foreground text-secondary"
                    )}
                  >
                    <button
                      disabled={loading}
                      type="button"
                      className="px-3 font-medium"
                      onClick={() =>
                        handleSelectSize(item.id, item.size.size, item.stock)
                      }
                    >
                      {item.size.size}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                Description
              </h3>
              <div
                className="prose dark:prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify
                    ? DOMPurify.sanitize(product.description)
                    : product.description,
                }}
              />
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                Reviews
              </h3>
            </div>
          </div>

          <div className="h-fit border shadow-md rounded-md hidden lg:block">
            <CardCheckout
              size={state.product_size.size}
              stock={state.product_size.stock}
              quantity={state.quantity}
              total_price={state.total_price}
              loading={loading}
              handleAddCart={handleAddCart}
              handleDecrement={handleDecrement}
              handleIncrement={handleIncrement}
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background shadow-[0_-2px_8px_rgba(0,0,0,0.1)] h-20 w-full flex items-center justify-between px-4 lg:hidden z-[10]">
        <div className="flex w-full justify-between items-center">
          <Button
            type="button"
            className="text-xs sm:text-base font-semibold uppercase flex items-center gap-x-1"
            onClick={() => setOpenCheckout(!openCheckout)}
          >
            Checkout
            <ChevronUp
              className={cn(
                "w-6 h-6 transition-transform",
                openCheckout ? "rotate-180" : ""
              )}
            />
          </Button>
          <div className="flex items-center gap-x-3">
            <ButtonOptions iconStyle="w-5 h-5" textStyle="hidden md:block" />
          </div>
        </div>
      </div>

      {/* Collapsible Panel */}
      <div
        className={cn(
          "fixed lg:hidden bottom-20 left-0 right-0 bg-secondary transition-all duration-300 overflow-hidden shadow-[0_-2px_8px_rgba(0,0,0,0.1)]",
          openCheckout ? "h-72" : "h-0"
        )}
      >
        <CardCheckout
          size={state.product_size.size}
          stock={state.product_size.stock}
          quantity={state.quantity}
          total_price={state.total_price}
          loading={loading}
          handleAddCart={handleAddCart}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
        />
      </div>
    </>
  );
};

export default ProductDetail;
