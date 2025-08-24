import React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dataSelect = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Name",
    value: "name",
  },
  {
    title: "Slug",
    value: "slug",
  },
];

interface SearchBarPorps {
  searchBy: "name" | "slug" | "all";
  searchInput: string;
  setSearchBy: React.Dispatch<React.SetStateAction<"name" | "slug" | "all">>;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({
  searchBy,
  setSearchBy,
  setSearchInput,
  searchInput,
}: SearchBarPorps) => {
  return (
    <div className="flex items-center gap-x-2">
      <Select
        value={searchBy}
        onValueChange={(val) => {
          setSearchBy(val as any);
          setSearchInput("");
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Search by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Search by</SelectLabel>
            {dataSelect.map((item, i) => (
              <SelectItem key={i} value={item.value}>
                {item.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Input Search */}
      <Input
        placeholder={`Type to search by ${searchBy}`}
        value={searchInput}
        className="text-sm"
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
