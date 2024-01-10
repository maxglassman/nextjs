import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import AskAQuestionButton from "./AskAQuestionButton";

interface Props {
  header: string;
  body: string;
  buttonLink: string;
  buttonText: string;
}

const NoResult = ({ header, body, buttonLink, buttonText }: Props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="No result illustration"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No result illustration"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
      />
      <h2 className="h2-bold mt-[30px]">{header}</h2>
      <p className="text-center w-[351px] mt-[14px] text-dark500_light700">
        {body}
      </p>
      <Link
        href={buttonLink}
        className="flex justify-end max-sm:w-full mt-[14px]"
      >
        <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
