import React from "react";
import { getQuestionById } from "@/lib/actions/question.action";
import Metric from "@/components/shared/Metric";
import { timeAgo } from "@/lib/utils";
import RenderTag from "@/components/shared/RenderTag";
import ParseHTML from "@/components/shared/ParseHTML";
import Filters from "@/components/shared/filters/Filters";
import { AnswerFilters } from "@/constants/filters";
import Answer from "@/components/shared/forms/Answer";
import AnswerCard from "@/components/shared/cards/AnswerCard";
import { getUserByClerkId } from "@/lib/actions/user.action";
import { getAnswers } from "@/lib/actions/answer.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Vote from "@/components/shared/Vote";

const Page = async ({ params }: { params: { questionId: string } }) => {
  const [question, answers] = await Promise.all([
    getQuestionById(params),
    getAnswers(params),
  ]);

  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const mongoUserId = await getUserByClerkId({ userId });
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
          href={`/profile/${userId}`}
          isAuthor={true}
          textStyles="paragraph-semibold text-dark400_light700"
        />
        <Vote
          isQuestion={true}
          upvotes={question.upvotes.length}
          downvotes={question.downvotes.length}
          hasUpvoted={question.upvotes.includes(mongoUserId._id)}
          hasDownvoted={question.downvotes.includes(mongoUserId._id)}
          hasStarred={mongoUserId.saved.includes(question._id)}
          user={JSON.stringify(mongoUserId)}
          itemId={question._id.toString()}
        />
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
      {answers.map((answer) => {
        return (
          <>
            <AnswerCard
              key={answer._id}
              answerId={answer._id.toString()}
              user={JSON.stringify(mongoUserId)}
              content={answer.content}
              upvotes={answer.upvotes.length}
              downvotes={answer.downvotes.length}
              hasUpvoted={answer.upvotes.includes(mongoUserId._id)}
              hasDownvoted={answer.downvotes.includes(mongoUserId._id)}
              author={answer.author}
              createdAt={answer.createdAt}
            />
            <div className="mt-[40px] border-t-[2px] border-light-800" />
          </>
        );
      })}
      <Answer
        mongoUser={JSON.stringify(mongoUserId)}
        question={JSON.stringify(question)}
      />
    </>
  );
};

export default Page;
