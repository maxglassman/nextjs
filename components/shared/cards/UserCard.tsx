import React from "react";
import RenderTag from "../RenderTag"; // Import the RenderTag component
import Link from "next/link";
import Image from "next/image";
import { getTopInteractedTagsParams } from "@/lib/actions/tag.action";
import { Badge } from "@/components/ui/badge";

// Define the types for the props
interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  const interactedTags = await getTopInteractedTagsParams({ userId: user._id });

  return (
    <Link
      href={`/profile/${user._id}`}
      className="background-light900_dark200 border light-border rounded-lg shadow-md p-6 text-center w-[266px]"
    >
      <article>
        <Image
          src={user.picture}
          alt={`Avatar of ${user.name}`}
          className="rounded-full mx-auto"
          height={100}
          width={100}
        />
        <div className="mt-4">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2 ">
            @{user.username}
          </p>
        </div>
        <div className=" mt-4">
          {interactedTags !== undefined ? (
            <div className="flex flex-wrap justify-center gap-2">
              {interactedTags.map((tag) => {
                return (
                  <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                );
              })}
            </div>
          ) : (
            <Badge>No Tags</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
