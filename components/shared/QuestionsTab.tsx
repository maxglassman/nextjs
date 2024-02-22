import React from "react";
import { SearchParamsProps } from "@/types";
import QuestionCard from "./cards/QuestionCard";
import { getQuestionsByUserId } from "@/lib/actions/question.action";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const userQuestions = await getQuestionsByUserId({ userId: userId });
  return (
    <div className="flex flex-col w-full mt-5 gap-5">
      {userQuestions.map((question) => {
        return (
          <QuestionCard
            key={question._id.toString()}
            _id={question._id.toString()}
            title={question.title}
            tags={question.tags}
            author={question.author}
            likes={question.upvotes.length}
            answers={question.answers.length}
            views={question.views}
            createdAt={question.createdAt}
          />
        );
      })}
    </div>
  );
};

export default QuestionsTab;
