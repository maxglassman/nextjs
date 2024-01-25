"use client";
import React from "react";
import Image from "next/image";
import { numberToString } from "@/lib/utils";
import {
  getQuestionById,
  upvoteQuestion,
  downvoteQuestion,
} from "@/lib/actions/question.action";
import {
  upvoteAnswer,
  downvoteAnswer,
  removeUpvoteAnswer,
  removeDownvoteAnswer,
} from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
  isQuestion: boolean;
  upvotes: any[];
  downvotes: any[];
  user: string;
  id: string;
}
interface HandleVoteParams {
  isQuestion: boolean;
  id: string;
  userId: string;
}

const Vote = ({ isQuestion, upvotes, downvotes, user, id }: Props) => {
  const { userId } = JSON.parse(user);

  const pathName = usePathname();

  const hasUpvoted = upvotes.includes(userId);
  const hasDownvoted = downvotes.includes(userId);

  const handleUpvote = async ({ isQuestion, id, userId }: HandleVoteParams) => {
    try {
      if (isQuestion) {
        await upvoteQuestion({
          questionId: id,
          userId: userId,
          path: pathName,
        });
      } else {
        await upvoteAnswer({
          answerId: id,
          userId: userId,
          path: pathName,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const handleDownvote = async ({
    isQuestion,
    id,
    userId,
  }: HandleVoteParams) => {
    try {
      if (isQuestion) {
        await downvoteQuestion({
          questionId: id,
          userId: userId,
          path: pathName,
        });
      } else {
        await downvoteAnswer({
          answerId: id,
          userId: userId,
          path: pathName,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <Image
        src={
          isQuestion || hasUpvoted
            ? "/assets/icons/upvoted.svg"
            : "/assets/icons/upvote.svg"
        }
        alt="Upvotes"
        width={18}
        height={18}
        onClick={() => handleUpvote({ isQuestion, id, userId })}
        className="hover:cursor-pointer"
      />
      <p className="background-light700_dark400 w-[18px] h-[18px] px-[5px] py-[3px] justify-center subtle-regular text-dark400_light900 items-center">
        {numberToString(upvotes.length)}
      </p>
      <Image
        src={
          isQuestion || hasDownvoted
            ? "/assets/icons/downvoted.svg"
            : "/assets/icons/downvote.svg"
        }
        alt="Downvotes"
        width={18}
        height={18}
        onClick={() => handleDownvote({ isQuestion, id, userId })}
        className="hover:cursor-pointer"
      />
      <p className="background-light700_dark400 w-[18px] h-[18px] px-[5px] py-[3px] justify-center subtle-regular text-dark400_light900 items-center">
        {numberToString(downvotes.length)}
      </p>
      {/* {question && (
        <Image
          src={
            starred ? "/assets/icons/star-red.svg" : "/assets/icons/star.svg"
          }
          alt="Star"
          width={18}
          height={18}
          onClick={handleStarred}
        />
      )} */}
    </div>
  );
};

export default Vote;
