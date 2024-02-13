"use client";

import React, { useState } from "react";
import { HomePageFilters } from "@/constants/filters";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../ui/button";
import { formUrlQuery } from "@/lib/utils";

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = searchParams.get("filter");

  const [activeFilter, setActiveFilter] = useState("");

  const handleFilter = (value: string) => {
    if (activeFilter === value) {
      setActiveFilter("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActiveFilter(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: value.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <section className="flex flex-row items-center gap-2 mt-[30px] max-md:hidden">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.name}
          className={`${
            activeFilter === filter.name
              ? "primary-gradient text-light-900"
              : "text-dark300_light900 background-light800_dark300"
          } small-medium`}
          onClick={() => handleFilter(filter.name)}
        >
          {filter.name}
        </Button>
      ))}
    </section>
  );
};

export default HomeFilter;
