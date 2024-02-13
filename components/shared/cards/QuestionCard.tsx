import React from "react";
import RenderTag from "../RenderTag";
import Image from "next/image";
import Link from "next/link";
import Metric from "../Metric";
import { timeAgo } from "@/lib/utils";
import { SignedIn, auth } from "@clerk/nextjs";
import EditDeleteAction from "../EditDeleteAction";

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: any[];
  author: { _id: string; clerkId: string; name: string; picture: string };
  createdAt: Date;
  likes: number;
  answers: number;
  views: number;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  createdAt,
  likes,
  answers,
  views,
}: QuestionCardProps) => {
  const showActionButtons = author.clerkId && author.clerkId === auth().userId;
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px] ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row ">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {timeAgo(createdAt)}
          </span>
          <Link href={`/question/${_id.replace(/^"|"$/g, "")}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={_id} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => {
          return <RenderTag key={tag._id} _id={tag._id} name={tag.name} />;
        })}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` • asked ${timeAgo(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor={true}
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={likes}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Answers"
          value={answers}
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
