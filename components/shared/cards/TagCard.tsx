import React from "react";
import RenderTag from "../RenderTag";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { numberToString } from "@/lib/utils";

interface TagCardProps {
  tag: {
    _id: string;
    name: string;
    description: string;
    questions: [];
  };
}

const TagCard = ({ tag }: TagCardProps) => {
  //TODO: REMOVE test test in <p> tag

  console.log(tag);
  return (
    <Link href={`/tag/${tag._id}`} className="shadow-light100_darknone">
      <article className="flex flex-col justify-between px-[30px] py-[40px] background-light900_dark200  border light-border rounded-md w-full sm:w-[260px]">
        <Badge className="background-light800_dark300 text-dark300_light900 paragraph-semibold rounded-md border-none px-4 py-2 w-fit">
          {tag.name}
        </Badge>
        <p className="small-regular text-dark500_light700 mt-[18px]">
          {tag.description !== undefined
            ? tag.description
            : "test test test test test test"}
        </p>
        <div className="flex flex-row flex-wrap justify-left gap-2 mt-[14px] items-center">
          <p className="body-regular text-primary-500">
            {tag.questions.length > 0
              ? `${numberToString(tag.questions.length)}+`
              : `${numberToString(12345)}+`}
          </p>
          <p className="small-regular text-dark400_light500">Questions</p>
        </div>
      </article>
    </Link>
  );
};

export default TagCard;
