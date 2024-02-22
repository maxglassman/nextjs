"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";
import GlobalFilters from "./GlobalFilters";
import error from "next/error";
import { getGlobalSearch } from "@/lib/actions/globalSearch.action";

interface Props {
  onClickOutside: () => void;
}

const GlobalResult = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const global = searchParams.get("global");
  const type = searchParams.get("type");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(
    Array<{ type: string; title: string; id: string }>
  );

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      try {
        if (global) {
          const queryResult = await getGlobalSearch({ searchQuery: global });
          // @ts-ignore
          setResult(queryResult);
        }
      } catch (error) {
        // catch the error object
        console.log("error", error); // log the error object
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "tags":
        return `/tag/${id}`;
      default:
        return "/";
    }
  };

  console.log(result);

  return (
    <div className="absolute flex flex-col w-full justify-between items-start p-2 mt-2 gap-4 rounded-xl background-light800_dark300">
      {isLoading && (
        <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
          <ReloadIcon className="my-2 h-10 w-10 text-primary-500 animate-spin" />
          <p className="body-semibol text-dark100_light900">Loading...</p>
        </div>
      )}
      {!isLoading && (
        <>
          <GlobalFilters />
          <div className="border w-full" />
          <div className="flex flex-col gap-2 w-full">
            <h3 className="h3-bold text-dark100_light900">Top Matches</h3>
            <div className="flex flex-col gap-2 w-full mt-3">
              {result
                .filter((r) => {
                  return type ? r.type === type : true;
                })
                .map((result, index) => {
                  return (
                    <div
                      key={result.id + result.type}
                      className="flex gap-3 items-start"
                    >
                      <Image
                        src="/assets/icons/tag.svg"
                        alt="tag"
                        width={20}
                        height={20}
                        className="invert-colors text-dark100_light900"
                      />
                      <div className="flex flex-col gap-1">
                        <Link
                          href={renderLink(result.type, result.id)}
                          className="body-semibold text-dark100_light900 line-clamp-1 hover:bg-light-700/50  dark:hover:bg-dark-500/50"
                        >
                          {result.title}
                        </Link>
                        <p className="small-medium capitalize text-dark400_light500">
                          {result.type}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalResult;
