import React from "react";

import { Input } from "@/components/ui/input";

interface SearchBarPorps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({ setSearchInput, searchInput }: SearchBarPorps) => {
  return (
    <div className="flex items-center gap-x-2">
      <Input
        placeholder={`Type to search`}
        value={searchInput}
        className="text-sm"
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
