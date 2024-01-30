import React from "react";
import { SearchParamsProps } from "@/types";
import AnswerCard from "./cards/AnswerCard";
import { getAnswersByUserId } from "@/lib/actions/answer.action";

interface Props extends SearchParamsProps {
  user: string;
}

const AnswersTab = async ({ searchParams, user }: Props) => {
  const mongoUser = JSON.parse(user);
  const userAnswers = await getAnswersByUserId({
    userId: mongoUser._id,
  });
  return (
    <div className="flex flex-col w-full mt-5 gap-5">
      {userAnswers.map((answer) => {
        return (
          <AnswerCard
            key={answer._id}
            answerId={answer._id}
            user={user}
            content={answer.content}
            upvotes={answer.upvotes.length}
            downvotes={answer.downvotes.length}
            author={answer.author}
            hasUpvoted={answer.upvotes.includes(mongoUser._id)}
            hasDownvoted={answer.downvotes.includes(mongoUser._id)}
            createdAt={answer.createdAt}
          />
        );
      })}
    </div>
  );
};

export default AnswersTab;
