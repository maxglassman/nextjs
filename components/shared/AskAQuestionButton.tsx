import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface Props {
  link: string;
  otherClasses?: string;
}

const AskAQuestionButton = ({ link, otherClasses }: Props) => {
  return (
    <Link href={link}>
      <Button
        className={`primary-gradient min-h-[46px] px-4 py-3 text-light-900 ${otherClasses}`}
      >
        Ask A Question
      </Button>
    </Link>
  );
};

export default AskAQuestionButton;
