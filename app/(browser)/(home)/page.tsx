import { ThemeToggle } from "@/components/themeToggle";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <ThemeToggle />
      <h1 className="text-5xl text-center font-extrabold">Hello World</h1>
      <h1 className="text-5xl text-center font-extrabold font-secondary">
        Hello World
      </h1>
    </div>
  );
};

export default HomePage;
