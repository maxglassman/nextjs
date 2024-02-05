import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import React from "react";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.action";

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

const TopQuestions = async () => {
  const hotQuestions = await getHotQuestions({ page: 1, pageSize: 5 });
  return (
    <div className="mt-7 w-full flex flex-col gap-[30px]">
      {hotQuestions.map((question) => {
        return (
          <Link
            key={question.qid}
            href={`/question/${question._id}`}
            className="flex cursor-pointer items-center justify-between flex-row gap-7"
          >
            <p className="body-medium text-dark500_light700">
              {question.title}
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

const RightSideBar = async () => {
  const topTags = await getTopPopularTags({ page: 1, pageSize: 5, limit: 5 });
  console.log(topTags);
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
          {topTags.map((tag) => {
            return (
              <RenderTag
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                totalQuestions={tag.totalQuestions}
                showTotalQuestions={true}
              />
            );
          })}
        </section>
      </div>
    </section>
  );
};

export default RightSideBar;
