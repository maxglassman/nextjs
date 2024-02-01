import React from "react";
import Image from "next/image";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

interface Props {
  clerkId: string;
  picture: string;
  name: string;
  username: string;
  website?: string;
  location?: string;
  createdAt: Date;
}
const ProfileCard = ({
  clerkId,
  picture,
  name,
  username,
  website,
  location,
  createdAt,
}: Props) => {
  const { userId } = auth();
  return (
    <div className="flex gap-4">
      <Image
        src={picture}
        alt={name}
        width={140}
        height={140}
        className="rounded-full"
      />
      <div className="flex flex-col justify-between py-2 gap-2">
        <h1 className="h1-bold text-dark100_light900">{name}</h1>
        <p className="small-regular text-dark400_light700">{`@${username}`}</p>
        <div className="flex justify-between mt-2 gap-2">
          {website && (
            <div className="flex gap-1">
              <Image
                src="/assets/icons/link.svg"
                alt="Link"
                width={14}
                height={14}
              />
              <p className="small-regular text-dark400_light700">{website}</p>
            </div>
          )}
          {location && (
            <div className="flex gap-1">
              <Image
                src="/assets/icons/location.svg"
                alt="Location"
                width={14}
                height={14}
              />
              <p className="small-regular text-dark400_light700">{location}</p>
            </div>
          )}
          <div className="flex gap-1">
            <Image
              src="/assets/icons/calendar.svg"
              alt="Calendar"
              width={14}
              height={14}
            />
            <p className="small-regular text-dark400_light700">
              {`Joined ${timeAgo(createdAt)}`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
        <SignedIn>
          {clerkId === userId && (
            <Link href={`/profile/${clerkId}/edit`}>
              <Button className="background-light800_dark400 text-dark300_light900">
                Edit Profile
              </Button>
            </Link>
          )}
        </SignedIn>
      </div>
    </div>
  );
};

export default ProfileCard;
