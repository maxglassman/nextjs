import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LocalSearch from "@/components/shared/search/LocalSearch";
export default function Home() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="h2-bold text-dark100_light900">All Questions</h2>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask A Question
          </Button>
        </Link>
      </div>
      <div className="mt-[30px]">
        <LocalSearch searchName="questions" />
      </div>
    </div>
  );
}
