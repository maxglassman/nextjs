import React from "react";
import { getQuestionById } from "@/lib/actions/question.action";
import Metric from "@/components/shared/Metric";
import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import RenderTag from "@/components/shared/RenderTag";
import ParseHTML from "@/components/shared/ParseHTML";
import Filters from "@/components/shared/filters/Filters";
import { AnswerFilters } from "@/constants/filters";
import Answer from "@/components/shared/forms/Answer";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { questionId: string } }) => {
  const question = await getQuestionById(params);
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const mongoUserId = await getUserById({ userId });
  return (
    <>
      <div className="flex flex-row justify-between items-center max-sm:flex-col-reverse max-sm:gap-4">
        <Metric
          imgUrl={question.author.picture}
          imgWidth={22}
          imgHeight={22}
          alt="user"
          value={question.author.name}
          title=""
          href={`/profile/${question.author._id}`}
          isAuthor={true}
          textStyles="paragraph-semibold text-dark400_light700"
        />
        <div className="flex flex-row gap-2">
          {/*Need to add functionality for upvotes, downvotes, and star*/}
          <Metric
            imgUrl="/assets/icons/upvote.svg"
            alt="Upvotes"
            imgWidth={18}
            imgHeight={18}
            value={`${question.upvotes + 0}`}
            title=""
            href="" //Need to add functionality for upvotes
            textStyles="background-light700_dark400 subtle-medium text-dark400_light700  px-2 py-1 text-center"
          />
          <Metric
            imgUrl="/assets/icons/downvote.svg"
            alt="Downvotes"
            imgWidth={18}
            imgHeight={18}
            value={`${question.downvotes + 0}`}
            title=""
            href="" //Need to add functionality for downvotes
            textStyles="background-light700_dark400 subtle-medium text-dark400_light700  px-2 py-1 text-center"
          />
          <Link href="/">
            <Image
              src="/assets/icons/star-red.svg"
              alt="Star"
              width={18}
              height={18}
              className="ml-1"
            />
          </Link>
        </div>
      </div>
      <h2 className="h2-semibold text-dark100_light900 mt-[14px]">
        {question.title}
      </h2>
      <div className="flex flex-row gap-2 mt-[14px]">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="Time"
          imgWidth={14}
          imgHeight={14}
          value={`Asked ${timeAgo(question.createdAt)}`}
          title=""
          href=""
          textStyles="subtle-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Answers"
          imgWidth={14}
          imgHeight={14}
          value={`${question.answers.length + 0}`}
          title="answers"
          href=""
          textStyles="subtle-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Views"
          imgWidth={14}
          imgHeight={14}
          value={`${question.views + 0}`}
          title="views"
          href=""
          textStyles="subtle-medium text-dark400_light700"
        />
      </div>
      <ParseHTML data={question.content} />
      <section className="flex flex-row flex-wrap mt-9 gap-2">
        {
          //@ts-ignore
          question.tags.map((tag) => {
            return <RenderTag key={tag._id} _id={tag._id} name={tag.name} />;
          })
        }
      </section>

      <div className="mt-9 flex justify-between items-center">
        <p className="paragraph-medium text-primary-500">{`${question.answers.length} Answers`}</p>
        <Filters filters={AnswerFilters} />
      </div>
      <div className="mt-[40px] border-t-[2px] border-light-800" />
      <Answer
        mongoUser={JSON.stringify(mongoUserId)}
        question={JSON.stringify(question)}
      />
    </>
  );
};

export default Page;
