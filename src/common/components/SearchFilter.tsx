import { Input } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  searchTextFromParent?: string | undefined;
}

export const CustomSearchFilter = ({ onSearch, searchTextFromParent }: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    sendToParent(value);
  };

  useEffect(() => {
    setSearchTerm(searchTextFromParent == undefined ? "" : searchTextFromParent);
  }, [searchTextFromParent]);

  const sendToParent = useDebouncedCallback((value) => {
    onSearch(value);
  }, 700);

  return (
    <Input
      value={searchTerm}
      onChange={handleInputChange}
      classNames={{
        input: "sm:min-w-[250px] w-full !min-h-10 !h-full pl-10",
      }}
      placeholder="Search"
      leftSection={<i className="icon-search text-xl/none"></i>}
    />
  );
};

export default CustomSearchFilter;
