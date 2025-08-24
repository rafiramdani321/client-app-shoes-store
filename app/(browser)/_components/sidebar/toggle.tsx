"use client";

import React from "react";
import { PanelLeft } from "lucide-react";

import { Hint } from "@/components/hint";
import { useSidebar } from "@/stores/useSidebar";

const Toggle = () => {
  const { onCollapse } = useSidebar((state) => state);

  return (
    <div className="flex justify-end">
      <Hint label="Collapse" side="bottom" asChild>
        <button
          onClick={onCollapse}
          className="h-auto p-2 hover:bg-secondary rounded-md"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </Hint>
    </div>
  );
};

export default Toggle;
