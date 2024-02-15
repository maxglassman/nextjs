"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface Props {
  morePages: boolean;
}
const Pagination = (params: Props) => {
  const { morePages } = params;
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const [pageNumber, setPageNumber] = useState(page);

  const handlePageChange = ({ direction }: { direction: string }) => {
    let newPageNumber = pageNumber;

    if (direction === "next" && morePages) {
      newPageNumber = pageNumber + 1;
    } else if (direction === "prev" && pageNumber > 1) {
      newPageNumber = pageNumber - 1;
    }

    setPageNumber(newPageNumber);

    let newUrl;
    if (newPageNumber > 1) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: newPageNumber.toString(),
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["page"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex justify-center items-center gap-3">
      <button
        className="background-light800_dark300 text-dark300_light900 p-2 rounded-sm shadow-md dark:shadow-none body-semibold"
        disabled={page == 1}
        onClick={() => handlePageChange({ direction: "prev" })}
      >
        Prev
      </button>
      <p className="primary-gradient px-2 py-1 rounded-sm text-white shadow-md dark:shadow-none">
        {page}
      </p>
      <button
        className="background-light800_dark300 text-dark300_light900 p-2 rounded-sm shadow-md dark:shadow-none body-semibold"
        disabled={!morePages}
        onClick={() => handlePageChange({ direction: "next" })}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
