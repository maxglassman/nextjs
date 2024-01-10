import React from "react";
import RenderTag from "../RenderTag";
import Image from "next/image";
import Link from "next/link";
import Metric from "../Metric";
import { timeAgo } from "@/lib/utils";

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: any[];
  author: { _id: string; name: string; picture: string };
  createdAt: Date;
  upvotes: number;
  answers: Array<object>;
  views: number;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  createdAt,
  upvotes,
  answers,
  views,
}: QuestionCardProps) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px] ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row ">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {timeAgo(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/*If signed in, show edit/delete buttons*/}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => {
          return <RenderTag key={tag._id} _id={tag._id} name={tag.name} />;
        })}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={` • asked ${timeAgo(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor={true}
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={upvotes}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Answers"
          value={answers.length}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Views"
          value={views}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;