import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

interface Props {
  searchName: string;
}

const LocalSearch = ({ searchName }: Props) => {
  return (
    <div className="relative w-full">
      <div className="background-light800_darkgradient relative flex min-h-[24px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="Search"
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder={`Search ${searchName}...`}
          value=""
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default LocalSearch;
