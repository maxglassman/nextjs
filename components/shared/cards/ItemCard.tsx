import React from "react";
import Image from "next/image";

//update interface so that if type == badge then title2 and value2 are not required, and badge is required.

interface BaseItemCardProps {
  type: string;
  title1: string;
  value1: number;
}

interface BadgeItemCardProps extends BaseItemCardProps {
  type: "badge";
  badge: string;
  title2?: never;
  value2?: never;
}

interface NonBadgeItemCardProps extends BaseItemCardProps {
  type: "non-badge";
  badge?: never;
  title2: string;
  value2: number;
}

type ItemCardProps = BadgeItemCardProps | NonBadgeItemCardProps;
const ItemCard = ({
  type,
  badge,
  title1,
  value1,
  title2,
  value2,
}: ItemCardProps) => {
  return (
    <div
      className={`flex flex-wrap min-h-[90px] min-w-[200px] background-light900_dark300 border light-border-1  rounded-md shadow-md dark:border-none  ${
        type == "non-badge"
          ? "px-[43px] items-center py-[25px] justify-center"
          : "px-[24px]"
      }`}
    >
      {type == "non-badge" ? (
        <div className="flex justify-between gap-11">
          <div className="flex flex-col">
            <p className="body-regular text-dark100_light900">{value1}</p>
            <p className="small-regular text-dark400_light500">{title1}</p>
          </div>
          <div className="flex flex-col">
            <p className="body-regular text-dark100_light900">{value2}</p>
            <p className="small-regular text-dark400_light500">{title2}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-[14px]">
          <Image src={badge || ""} alt="Gold Medal" width={36} height={50} />
          <div className="flex flex-col">
            <p className="body-regular text-dark100_light900">{value1}</p>
            <p className="small-regular text-dark400_light500">{title1}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
