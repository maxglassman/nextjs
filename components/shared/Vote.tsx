"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { numberToString } from "@/lib/utils";
import {
  upvoteQuestion,
  downvoteQuestion,
} from "@/lib/actions/question.action";
import { upvoteAnswer, downvoteAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { userSaveQuestion } from "@/lib/actions/user.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { useRouter } from "next/navigation";

interface Props {
  isQuestion: boolean;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  hasStarred?: boolean;
  user: string;
  itemId: string;
}
interface HandleVoteParams {
  isQuestion: boolean;
  itemId: string;
  userId: string;
}

const Vote = ({
  isQuestion,
  upvotes,
  downvotes,
  hasUpvoted,
  hasDownvoted,
  hasStarred,
  user,
  itemId,
}: Props) => {
  const userId = JSON.parse(user)._id;
  const pathName = usePathname();
  const router = useRouter();
  const [upvotedStatus, setUpvotedStatus] = useState(hasUpvoted);
  const [downvotedStatus, setDownvotedStatus] = useState(hasDownvoted);
  const [starredStatus, setStarredStatus] = useState(hasStarred);
  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const [downvoteCount, setDownvoteCount] = useState(downvotes);

  const handleUpvote = ({ isQuestion, itemId, userId }: HandleVoteParams) => {
    try {
      if (upvotedStatus) {
        setUpvotedStatus(false);
        setUpvoteCount(upvoteCount - 1);
      } else {
        if (downvotedStatus) {
          setDownvotedStatus(false);
          setDownvoteCount(downvoteCount - 1);
        }
        setUpvotedStatus(true);
        setUpvoteCount(upvoteCount + 1);
      }

      if (isQuestion) {
        upvoteQuestion({
          questionId: itemId,
          userId: userId,
          path: pathName,
        });
      } else {
        upvoteAnswer({
          answerId: itemId,
          userId: userId,
          path: pathName,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const handleDownvote = ({ isQuestion, itemId, userId }: HandleVoteParams) => {
    try {
      if (downvotedStatus) {
        setDownvotedStatus(false);
        setDownvoteCount(downvoteCount - 1);
      } else {
        if (upvotedStatus) {
          setUpvotedStatus(false);
          setUpvoteCount(upvoteCount - 1);
        }
        setDownvotedStatus(true);
        setDownvoteCount(downvoteCount + 1);
      }
      if (isQuestion) {
        downvoteQuestion({
          questionId: itemId,
          userId: userId,
          path: pathName,
        });
      } else {
        downvoteAnswer({
          answerId: itemId,
          userId: userId,
          path: pathName,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  interface StarredProps {
    itemId: string;
    userId: string;
  }
  const handleStarred = async ({ itemId, userId }: StarredProps) => {
    try {
      if (starredStatus) {
        setStarredStatus(false);
      } else {
        setStarredStatus(true);
      }
      userSaveQuestion({
        questionId: itemId,
        userId: userId,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    if (isQuestion) {
      viewQuestion({
        questionId: itemId,
        userId: userId ? userId : undefined,
      });
    }
  }, []); // Empty array as second argument

  return (
    <div className="flex flex-row gap-2">
      <Image
        src={
          isQuestion || upvotedStatus
            ? "/assets/icons/upvoted.svg"
            : "/assets/icons/upvote.svg"
        }
        alt="Upvotes"
        width={18}
        height={18}
        onClick={() => handleUpvote({ isQuestion, itemId, userId })}
        className="hover:cursor-pointer"
      />
      <p className="background-light700_dark400 w-[18px] h-[18px] px-[5px] py-[3px] justify-center subtle-regular text-dark400_light900 items-center">
        {numberToString(upvoteCount)}
      </p>
      <Image
        src={
          isQuestion || downvotedStatus
            ? "/assets/icons/downvoted.svg"
            : "/assets/icons/downvote.svg"
        }
        alt="Downvotes"
        width={18}
        height={18}
        onClick={() => handleDownvote({ isQuestion, itemId, userId })}
        className="hover:cursor-pointer"
      />
      <p className="background-light700_dark400 w-[18px] h-[18px] px-[5px] py-[3px] justify-center subtle-regular text-dark400_light900 items-center">
        {numberToString(downvoteCount)}
      </p>
      {isQuestion && (
        <Image
          src={
            starredStatus
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="Star"
          width={18}
          height={18}
          onClick={() => handleStarred({ itemId, userId })}
          className="hover:cursor-pointer"
        />
      )}
    </div>
  );
};

export default Vote;
