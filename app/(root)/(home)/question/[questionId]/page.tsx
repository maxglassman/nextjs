import QuestionCard from "@/components/shared/cards/QuestionCard";
import Question from "@/database/question.model";
import React from "react";
import { getQuestionById } from "@/lib/actions/question.action";
import { useRouter } from "next/router";

const page = async ({ params }: { params: { questionId: string } }) => {
  console.log(params);
  const question = await getQuestionById(params);
  return <div>{/* <QuestionCard /> */}</div>;
};

export default page;
