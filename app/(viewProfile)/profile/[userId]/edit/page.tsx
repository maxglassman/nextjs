import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Profile from "@/components/shared/forms/Profile";
import { getUserByClerkId } from "@/lib/actions/user.action";

const Page = async ({ params }: { params: { userId: string } }) => {
  const clerkId = params.userId;
  const { userId } = auth();

  if (clerkId !== userId) {
    redirect("/");
  }

  const mongoUserId = await getUserByClerkId({ userId });

  return (
    <>
      <h1 className="h1-bold">Edit Profile</h1>
      <Profile
        clerkId={clerkId}
        name={mongoUserId.name}
        username={mongoUserId.username}
        portfolioWebsite={
          mongoUserId.portfolioWebsite ? mongoUserId.portfolioWebsite : ""
        }
        location={mongoUserId.location ? mongoUserId.location : ""}
        bio={mongoUserId.bio ? mongoUserId.bio : ""}
      />
    </>
  );
};

export default Page;
