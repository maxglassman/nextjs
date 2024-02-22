"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keys: ["q"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div className="relative w-full">
      <div
        className={`background-light800_darkgradient relative flex min-h-[24px] grow items-center gap-1 rounded-xl px-4 ${otherClasses}`}
      >
        {iconPosition === "left" && (
          <Image
            src={imgSrc}
            width={24}
            height={24}
            alt="Search"
            className="cursor-pointer"
          />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="paragraph-regular no-focus placeholder background-light800_darkgradient text-dark400_light700 border-none shadow-none outline-none"
        />
        {iconPosition === "right" && (
          <Image
            src={imgSrc}
            width={24}
            height={24}
            alt="Search"
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default LocalSearch;
