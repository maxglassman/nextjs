import React from "react";
import Image from "next/image";
import Metric from "../Metric";
import ParseHTML from "../ParseHTML";
import { timeAgo } from "@/lib/utils";

interface Props {
  _id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  author: { _id: string; name: string; picture: string };
  createdAt: Date;
}

const AnswerCard = ({
  _id,
  content,
  upvotes,
  downvotes,
  author,
  createdAt,
}: Props) => {
  return (
    <>
      <section className="flex justify-between mt-8">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` • answered ${timeAgo(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor={true}
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex flex-row gap-2">
          {/*Need to add functionality for upvotes, downvotes, and star*/}
          <Metric
            imgUrl="/assets/icons/upvote.svg"
            alt="Upvotes"
            imgWidth={18}
            imgHeight={18}
            value={`${upvotes}`}
            title=""
            href="" //Need to add functionality for upvotes
            textStyles="background-light700_dark400 subtle-medium text-dark400_light700  px-2 py-1 text-center"
          />
          <Metric
            imgUrl="/assets/icons/downvote.svg"
            alt="Downvotes"
            imgWidth={18}
            imgHeight={18}
            value={`${downvotes}`}
            title=""
            href="" //Need to add functionality for downvotes
            textStyles="background-light700_dark400 subtle-medium text-dark400_light700  px-2 py-1 text-center"
          />
        </div>
      </section>
      <ParseHTML data={content} />
    </>
  );
};

export default AnswerCard;
