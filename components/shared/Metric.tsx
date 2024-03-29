import React from "react";
import Image from "next/image";
import Link from "next/link";
import { numberToString } from "@/lib/utils";

interface Props {
  imgUrl: string;
  imgWidth?: number;
  imgHeight?: number;
  alt: string;
  value: number | string;
  title: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgUrl,
  imgWidth = 16,
  imgHeight = 16,
  alt,
  value,
  title,
  href,
  textStyles,
  isAuthor,
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {numberToString(value || 0)}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
