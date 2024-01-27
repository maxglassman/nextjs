import React from "react";
import { getUserById } from "@/lib/actions/user.action";
import ProfileCard from "@/components/shared/cards/ProfileCard";
import { timeAgo } from "@/lib/utils";

const Page = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const user = await getUserById({ userId });

  return (
    <div>
      <ProfileCard
        _id={user._id}
        picture={user.picture}
        name={user.name}
        username={user.username}
        website={user.website}
        location={user.location}
        createdAt={user.createdAt}
      />
    </div>
  );
};

export default Page;
