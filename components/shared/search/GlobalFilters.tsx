"use client";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [selectedType, setSelectedType] = useState(type);

  const handleTypeSelection = (type: string) => {
    if (type === selectedType) {
      setSelectedType("");
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["type"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      setSelectedType(type);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: type,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex gap-4 items-center mt-2">
      <h3 className="h3-bold text-dark100_light900">Type:</h3>
      <section className="flex gap-3">
        <button
          onClick={() => handleTypeSelection("question")}
          className={`rounded-md body-semibold p-2 ${
            type == "question"
              ? "bg-primary-500 text-white"
              : "background-light700_dark400 text-dark100_light900"
          }`}
        >
          Question
        </button>
        <button
          onClick={() => handleTypeSelection("answer")}
          className={`rounded-md body-semibold p-2 ${
            type == "answer"
              ? "bg-primary-500 text-white"
              : "background-light700_dark400 text-dark100_light900"
          }`}
        >
          Answer
        </button>
        <button
          onClick={() => handleTypeSelection("user")}
          className={`rounded-md body-semibold p-2 ${
            type == "user"
              ? "bg-primary-500 text-white"
              : "background-light700_dark400 text-dark100_light900"
          }`}
        >
          User
        </button>
        <button
          onClick={() => handleTypeSelection("tags")}
          className={`rounded-md body-semibold p-2 ${
            type == "tags"
              ? "bg-primary-500 text-white"
              : "background-light700_dark400 text-dark100_light900"
          }`}
        >
          Tags
        </button>
      </section>
    </div>
  );
};

export default GlobalFilters;
