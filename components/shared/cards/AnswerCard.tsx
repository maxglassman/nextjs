import React from "react";
import Image from "next/image";
import Metric from "../Metric";
import ParseHTML from "../ParseHTML";
import { timeAgo } from "@/lib/utils";
import Vote from "../Vote";
import EditDeleteAction from "../EditDeleteAction";
import { SignedIn, auth } from "@clerk/nextjs";

interface Props {
  answerId: string;
  user: string;
  content: string;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  author: { _id: string; name: string; picture: string };
  createdAt: Date;
}

const AnswerCard = ({
  answerId,
  user,
  content,
  upvotes,
  downvotes,
  hasUpvoted,
  hasDownvoted,
  author,
  createdAt,
}: Props) => {
  const showActionButtons =
    JSON.parse(user).clerkId && JSON.parse(user).clerkId === auth().userId;
  return (
    <>
      <section className="flex justify-between mt-8">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` • answered ${timeAgo(createdAt)}`}
          href={`/profile/${JSON.parse(user).clerkId}`}
          isAuthor={true}
          textStyles="body-medium text-dark400_light700"
        />
        <Vote
          isQuestion={false}
          upvotes={upvotes}
          downvotes={downvotes}
          hasUpvoted={hasUpvoted}
          hasDownvoted={hasDownvoted}
          user={user}
          itemId={answerId}
        />
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(answerId)} />
          )}
        </SignedIn>
        {/* <div className="flex flex-row gap-2">
          {/*Need to add functionality for upvotes, downvotes, and star
          <Metric
            imgUrl="/assets/icons/upvote.svg"
            alt="Upvotes"
            imgWidth={18}
            imgHeight={18}
            value={`${upvotes}`}
            title=""
            href="" //Need to add functionality for upvotes
            textStyles="background-light700_dark400 subtle-medium text-dark400_light700  px-2 py-1 text-center"
          />
          <Metric
            imgUrl="/assets/icons/downvote.svg"
            alt="Downvotes"
            imgWidth={18}
            imgHeight={18}
            value={`${downvotes}`}
            title=""
            href="" //Need to add functionality for downvotes
            textStyles="background-light700_dark400 subtle-medium text-dark400_light700  px-2 py-1 text-center"
          />
        </div> */}
      </section>
      <ParseHTML data={content} />
    </>
  );
};

export default AnswerCard;
