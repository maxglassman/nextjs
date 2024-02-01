import React from "react";
import {
  getUserById,
  getUserStats,
  getUserByClerkId,
} from "@/lib/actions/user.action";
import ProfileCard from "@/components/shared/cards/ProfileCard";
import ItemCard from "@/components/shared/cards/ItemCard";
import { getQuestionsByUserId } from "@/lib/actions/question.action";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import RenderTag from "@/components/shared/RenderTag";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionsTab from "@/components/shared/QuestionsTab";
import AnswersTab from "@/components/shared/AnswersTab";

const Page = async ({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { q: string };
}) => {
  const { userId } = params;
  const user = await getUserByClerkId({ userId });

  const [userStats, userQuestions] = await Promise.all([
    getUserStats({ userId: JSON.stringify(user._id) }),
    getQuestionsByUserId(user._id),
  ]);

  return (
    <div className="flex flex-col w-fit">
      <ProfileCard
        clerkId={user.clerkId}
        picture={user.picture}
        name={user.name}
        username={user.username}
        website={user.portfolioWebsite}
        location={user.location}
        createdAt={user.createdAt}
      />
      {user.bio && (
        <p className="flex paragraph-regular text-dark400_light700 mt-4 justify-center w-fit min-w-[300px] px-[150px]">
          {user.bio}
        </p>
      )}
      <h3 className="h3-bold text-dark100_light900 mt-4">Stats</h3>
      <div className="mt-5 gap-5 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
        <ItemCard
          type="non-badge"
          title1="Questions"
          value1={userStats.questionCount}
          title2="Answers"
          value2={userStats.answerCount}
        />
        <ItemCard
          type="badge"
          title1="Gold Badges"
          badge="/assets/icons/gold-medal.svg"
          value1={15} //update with gold badge count
        />
        <ItemCard
          type="badge"
          title1="Silver Badges"
          badge="/assets/icons/silver-medal.svg"
          value1={15} //update with gold badge count
        />
        <ItemCard
          type="badge"
          title1="Bronze Badges"
          badge="/assets/icons/bronze-medal.svg"
          value1={15} //update with gold badge count
        />
      </div>
      <div className="flex mt-12 gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionsTab userId={user._id} searchParams={searchParams} />
          </TabsContent>
          <TabsContent value="answers">
            <AnswersTab
              user={JSON.stringify(user)}
              searchParams={searchParams}
            />
          </TabsContent>
        </Tabs>
        <div className="flex flex-col w-fit">
          <h3 className="h3-bold text-dark100_light900"> Top Tags</h3>
          <div className="flex flex-col mt-5 gap-5">
            <RenderTag
              _id={"1"}
              name={"javascript"}
              totalQuestions={1000}
              showTotalQuestions={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
