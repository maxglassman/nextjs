"use client";
import React from "react";
import Image from "next/image";
import { deleteQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { deleteAnswer } from "@/lib/actions/answer.action";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const path = usePathname();
  const router = useRouter();
  const handleEdit = async () => {
    router.push(`/question/${itemId}/edit`);
  };
  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: itemId, path: path });
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: itemId, path: path });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer"
          onClick={() => {
            handleEdit();
          }}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="edit"
        width={14}
        height={14}
        className="cursor-pointer"
        onClick={() => {
          handleDelete();
        }}
      />
    </div>
  );
};

export default EditDeleteAction;
