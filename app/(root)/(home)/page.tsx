"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LocalSearch from "@/components/shared/search/LocalSearch";
import HomeFilter from "@/components/shared/filters/HomeFilter";
import Filters from "@/components/shared/filters/Filters";
import { HomePageFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLAlchemy",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "sqlalchemy" },
    ],
    author: {
      _id: "author_id_1",
      name: "John Doe",
      picture: "author_picture_url_1",
    },
    upvotes: 10,
    answers: [{}], // Assuming no specific structure for answer objects
    views: 100,
    createdAt: new Date("2021-05-20T13:00:00.000Z"),
  },
  {
    _id: "2",
    title: "Understanding React Hooks",
    tags: [
      { _id: "3", name: "javascript" },
      { _id: "4", name: "react" },
    ],
    author: {
      _id: "author_id_2",
      name: "Jane Smith",
      picture: "author_picture_url_2",
    },
    upvotes: 20,
    answers: [{}], // Assuming no specific structure for answer objects
    views: 20000,
    createdAt: new Date("2021-06-15T09:30:00.000Z"),
  },
];

export default function Home() {
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
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} {...question} />
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
