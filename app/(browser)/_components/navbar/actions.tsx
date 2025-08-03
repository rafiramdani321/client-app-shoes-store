import { Handbag } from "lucide-react";
import Link from "next/link";
import React from "react";

const Actions = () => {
  return (
    <div className="flex gap-x-4">
      <Handbag className="w-6 h-6 cursor-pointer" />
      <Link href="/" className="uppercase font-semibold hover:underline">
        Signin
      </Link>
    </div>
  );
};

export default Actions;
