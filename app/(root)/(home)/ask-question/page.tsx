import AskAQuestionButton from "@/components/shared/AskAQuestionButton";
import Tiptap from "@/components/shared/TipTap";
import Question from "@/components/shared/forms/Question";
import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/lib/actions/user.action";

interface Props {
  questionPrompt: string;
  tip: string;
  mandatory: boolean;
  inputComponent?: React.ReactNode;
}

const page = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const mongoUserId = await getUserByClerkId({ userId });

  return (
    <div className="flex flex-col gap-9 overflow-auto z-10">
      <h1 className="h1-bold text-dark100_light900">Ask a Public Question</h1>
      <Question type="create" mongoUserId={JSON.stringify(mongoUserId)} />
      {/* <QuestionPageItem
        questionPrompt="Question Title"
        tip="Be specific and imagine you’re asking a question to another person."
        mandatory={true}
      />
      <QuestionPageItem
        questionPrompt="Detailed explanation of your problem?"
        tip="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
        mandatory={true}
        inputComponent={<Tiptap />}
      />
      <QuestionPageItem
        questionPrompt="Tags?"
        tip="Add up to 5 tags to describe what your question is about."
        mandatory={true}
      /> */}
    </div>
  );
};

export default page;
