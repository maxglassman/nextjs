import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import React from "react";

//TODO:
// Create div for right side bar
// Create 2 sections for right side bar, Top Questions and Popular Tags
// Top Questions section has to map through the top questions array and display the top questions, Link, Text and arrow image
// Popular Tags section has to map through the popular tags array and display the popular tags, Link, Badge, text

const TopQuestions = () => {
  const dummyQuestions = [
    {
      qid: 1,
      question: "Dummy Question 1",
      link: "/dummy",
    },
    { qid: 2, question: "Dummy Question 2", link: "/dummy" },
    { qid: 3, question: "Dummy Question 3", link: "/dummy" },
    { qid: 4, question: "Dummy Question 4", link: "/dummy" },
    { qid: 5, question: "Dummy Question 5", link: "/dummy" },
  ];

  return (
    <section className="flex flex-col gap-[30px]">
      {dummyQuestions.map((question) => {
        return (
          <Link
            key={question.qid}
            href={question.link}
            className="flex flex-row gap-5"
          >
            <p className="font-inter max-w-[248px] text-dark500_light700">
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
    </section>
  );
};

const PopularTags = () => {
  const dummyTags = [
    { tag: "Javascript", count: 1234, url: "/dummy" },
    { tag: "Python", count: 1234, url: "/dummy" },
    { tag: "C++", count: 1234, url: "/dummy" },
    { tag: "React.JS", count: 1234, url: "/dummy" },
  ];
  return (
    <section className="flex flex-col gap-[30px]">
      {dummyTags.map((tag) => {
        return (
          <Link key={tag.tag} href={tag.url} className="flex flex-row gap-5">
            <Badge>{tag.tag}</Badge>
            <p className="font-inter max-w-[248px] text-dark500_light700">
              {tag.count}
            </p>
          </Link>
        );
      })}
    </section>
  );
};
const RightSideBar = () => {
  return (
    <div className=" custom-scrollbar light-border border-left overflow-y-auto background-light900_dark200 flex flex-col justify-between h-screen lg:w-fit max-lg:hidden pt-[164px] pb-[50px] px-4">
      <h3 className="text-dark200_light900 h3-bold font-inter">
        Top Questions
      </h3>
      <TopQuestions />
      <h3 className="text-dark200_light900 h3-bold font-inter">Popular Tags</h3>
      <PopularTags />
    </div>
  );
};

//TODO
export default RightSideBar;
