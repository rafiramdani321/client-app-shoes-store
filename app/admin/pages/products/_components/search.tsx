import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const dataSelect = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Title",
    value: "title",
  },
  {
    title: "Slug",
    value: "slug",
  },
  {
    title: "Category",
    value: "category",
  },
  {
    title: "Sub category",
    value: "sub_category",
  },
];

type SearchType = "title" | "slug" | "category" | "sub_category" | "all";

interface SearchBarPorps {
  searchBy: SearchType;
  searchInput: string;
  setSearchBy: React.Dispatch<React.SetStateAction<SearchType>>;
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
