import { cn } from "@/lib/utils";
import { Heart, MessageSquareText, Share2 } from "lucide-react";
import React from "react";

type ButtonOptionsProps = {
  iconStyle?: string;
  textStyle?: string;
};

const ButtonOptions = ({ iconStyle, textStyle }: ButtonOptionsProps) => {
  const iconClassName = iconStyle ? iconStyle : "w-4 h-4 lg:w-5 lg:h-5";
  const textClassName = textStyle ? textStyle : "";
  return (
    <>
      <button className="flex items-center gap-x-2 cursor-pointer">
        <MessageSquareText className={iconClassName} />
        <span className={cn("text-xs font-semibold", textClassName)}>Chat</span>
      </button>
      <div className="border h-5" />
      <button className="flex items-center gap-x-2 cursor-pointer">
        <Heart className={iconClassName} />
        <span className={cn("text-xs font-semibold", textClassName)}>
          Wishlist
        </span>
      </button>
      <div className="border h-5" />
      <button className="flex items-center gap-x-2 cursor-pointer">
        <Share2 className={iconClassName} />
        <span className={cn("text-xs font-semibold", textClassName)}>
          Share
        </span>
      </button>
    </>
  );
};

export default ButtonOptions;
