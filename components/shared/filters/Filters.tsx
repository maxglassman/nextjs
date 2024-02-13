"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface Props {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filters = ({ filters, otherClasses, containerClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = searchParams.get("filter");

  const [selectedFilter, setSelectedFilter] = useState(filter || "");

  const handleFilter = (value: string) => {
    if (selectedFilter === value) {
      setSelectedFilter("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setSelectedFilter(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: value.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select defaultValue={filter || undefined} onValueChange={handleFilter}>
        <SelectTrigger
          className={`${otherClasses} body-regular rlight-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <SelectValue placeholder="Select a Filter" />
        </SelectTrigger>
        <SelectContent>
          {filters.map((filter) => {
            return (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
