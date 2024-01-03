import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import React from "react";
import RenderTag from "./RenderTag";

const dummyTags = [
  {
    _id: "1",
    name: "Javascript",
    totalQuestions: 1234,
    showTotalQuestions: true,
  },
  { _id: "2", name: "Python", totalQuestions: 1234, showTotalQuestions: true },
  { _id: "3", name: "C++", totalQuestions: 1234, showTotalQuestions: true },
  {
    _id: "4",
    name: "React.JS",
    totalQuestions: 1234,
    showTotalQuestions: true,
  },
];

const TopQuestions = () => {
  const dummyQuestions = [
    {
      qid: 1,
      question:
        "Would it be appropriate to point out an error in another paper during a referee report?",
    },
    {
      qid: 2,
      question: "How can an airconditioning machine exist?",
    },
    {
      qid: 3,
      question: "Interrogated every time crossing UK Border as citizen",
    },
    { qid: 4, question: "Low digit addition generator", link: "/dummy" },
    {
      qid: 5,
      question: "What is an example of 3 numbers that do not make up a vector?",
    },
  ];

  return (
    <div className="mt-7 w-full flex flex-col gap-[30px]">
      {dummyQuestions.map((question) => {
        return (
          <Link
            key={question.qid}
            href={`/questions/${question.qid}`}
            className="flex cursor-pointer items-center justify-between flex-row gap-7"
          >
            <p className="body-medium text-dark500_light700">
              {question.question}
            </p>
            <Image
              src="/assets/icons/right.svg"
              alt="arrow"
              width={20}
              height={20}
              className="invert-colors"
            />
          </Link>
        );
      })}
    </div>
  );
};

const RightSideBar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col  overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="text-dark200_light900 h3-bold">Top Questions</h3>
        <TopQuestions />
      </div>
      <div className="mt-16">
        <h3 className="text-dark200_light900 h3-bold font-inter">
          Popular Tags
        </h3>
        <section className="mt-7 w-full flex flex-col gap-[30px]">
          {dummyTags.map((tag) => {
            return <RenderTag key={tag._id} {...tag} />;
          })}
        </section>
      </div>
    </section>
  );
};

export default RightSideBar;
