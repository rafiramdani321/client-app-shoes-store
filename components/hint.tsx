import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import clsx from "clsx";

interface HintProps {
  label: string;
  children: React.ReactNode;
  asChild: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const Hint = ({ label, children, asChild, side, align }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={1}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent
          className={clsx(
            "bg-secondary-foreground text-secondary rounded-sm z-[999] border-secondary"
          )}
          side={side}
          align={align}
        >
          <p className="text-[11px]">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
