import React from "react";
import Question from "@/components/shared/forms/Question";
import { auth } from "@clerk/nextjs";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserByClerkId } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { questionId: string } }) => {
  const { questionId } = params;
  const clerkUserId = auth().userId;

  const [question, user] = await Promise.all([
    getQuestionById({ questionId: questionId }),
    getUserByClerkId({ userId: clerkUserId }),
  ]);

  //   if (!question || !user) {
  //     redirect("/");
  //   }

  return (
    <div>
      <h1 className="h1-bold">Edit Question</h1>
      <Question
        mongoUserId={user._id.toString()}
        type="edit"
        questionId={questionId}
        title={question.title}
        content={question.content}
        tags={question.tags.map((tag: any) => tag.name)}
      />
    </div>
  );
};

export default Page;
