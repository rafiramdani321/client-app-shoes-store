"use client";

import React from "react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-secondary font-extrabold tracking-tighter uppercase"
    >
      Shoesstore
    </Link>
  );
};

export default Logo;
