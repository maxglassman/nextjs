import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LocalSearch from "@/components/shared/search/LocalSearch";
import HomeFilter from "@/components/shared/filters/HomeFilter";
import Filters from "@/components/shared/filters/Filters";
import { HomePageFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";

export default async function Home() {
  const result = await getQuestions({});
  return (
    <div>
      <div className="flex justify-between items-center max-sm:flex-col-reverse">
        <h2 className="h2-bold text-dark100_light900">All Questions</h2>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask A Question
          </Button>
        </Link>
      </div>
      <div className="mt-[30px] max-md:flex max-md:gap-2">
        <LocalSearch
          route="questions"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1 min-h-[56px]"
        />
        <Filters
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        <HomeFilter />
      </div>
      <div className="mt-10 w-full flex flex-col gap-4 ">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
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
            header="There's no questions to show"
            body="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            buttonLink="/ask-question"
            buttonText="Ask A Question"
          />
        )}
      </div>
    </div>
  );
}
