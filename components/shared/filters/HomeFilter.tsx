"use client";

import React, { useState } from "react";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "../../ui/button";
import Image from "next/image";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../../ui/menubar";
import Home from "@/app/(root)/(home)/page";

const HomeFilter = () => {
  const [activeFilter, setActiveFilter] = useState("");

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
          onClick={() => setActiveFilter(filter.name)}
        >
          {filter.name}
        </Button>
      ))}
    </section>
  );
};

export default HomeFilter;
