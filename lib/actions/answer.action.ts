"use server";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import { CreateAnswerParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    const answer = await Answer.create({ content, author, question });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });
    revalidatePath(path, "page");
  } catch (error) {
    console.log(error);
    throw error;
  }
}
