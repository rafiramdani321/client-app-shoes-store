import { toast } from "sonner";

type ToastPosition =
  | "top-center"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

export const showToastError = (
  message: string,
  position: ToastPosition = "top-right",
  duration: number = 3000
) => {
  toast.error(message, {
    duration,
    position,
  });
};

// Fungsi toast success
export const showToastSuccess = (
  message: string,
  position: ToastPosition = "top-right",
  duration: number = 3000
) => {
  toast.success(message, {
    style: {
      color: "green",
      backgroundColor: "#e6ffed",
      border: "1px solid #3fc77a",
    },
    position,
    duration,
  });
};
