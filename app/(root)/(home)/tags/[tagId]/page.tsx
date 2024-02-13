import React from "react";
import { getQuestionsByTag } from "@/lib/actions/question.action";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";

const page = async ({
  params,
  searchParams,
}: {
  params: { tagId: string };
  searchParams: { q: string };
}) => {
  const result = await getQuestionsByTag({
    tagId: params.tagId,
    page: 1,
    searchQuery: searchParams.q,
  });

  return (
    <div>
      <h1 className="h1-bold">{`Questions for ${result.tagTitle}`}</h1>
      <div className="mt-10 w-full flex flex-col gap-4 ">
        {result.tagQuestions.length > 0 ? (
          result.tagQuestions.map((question: any) => (
            <QuestionCard
              key={JSON.stringify(question._id)}
              _id={JSON.stringify(question._id)}
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
            header="There are no questions for this tag"
            body="You can create a question for this tag by clicking on the ask question button."
            buttonLink="/ask-question"
            buttonText="Ask a Question"
          />
        )}
      </div>
    </div>
  );
};

export default page;
