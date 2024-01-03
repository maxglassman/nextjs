import React from "react";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showTotalQuestions?: boolean;
}

const RenderTag = ({
  _id,
  name,
  totalQuestions,
  showTotalQuestions,
}: Props) => {
  return (
    <Link
      key={_id}
      href={`/tags/${_id}`}
      className="flex items-center flex-row justify-between gap-5"
    >
      <Badge className="background-light800_dark300 text-dark400_light500 subtle-medium rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>
      {showTotalQuestions && (
        <p className="font-inter max-w-[248px] text-dark400_light500 text-[12px] font-medium">
          {`${totalQuestions}`}
        </p>
      )}
    </Link>
  );
};

export default RenderTag;
