import React from "react";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import NoResult from "@/components/shared/NoResult";
import { getSavedQuestions } from "@/lib/actions/question.action";
import { getUserByClerkId } from "@/lib/actions/user.action";

const page = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const mongoUserId = await getUserByClerkId({ userId });

  const result = await getSavedQuestions({ userId: mongoUserId._id });
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-10 w-full flex flex-col gap-4 ">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              likes={question.upvotes.length}
              answers={question.answers.length}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            header="There are no saved questions to show"
            body="You can save questions by clicking on the star icon on the question card."
            buttonLink="/"
            buttonText="See Questions"
          />
        )}
      </div>
    </div>
  );
};

export default page;
