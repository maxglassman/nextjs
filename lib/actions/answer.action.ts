"use server";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import {
  CreateAnswerParams,
  GetAnswersParams,
  GetAnswerParams,
  VoteAnswerParams,
} from "./shared.types";
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

    //TODO: add interaction
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        select: "_id clerkId name picture",
      })
      .sort({ createdAt: -1 });

    return answers;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswerById(params: GetAnswerParams) {
  try {
    connectToDatabase();
    const { answerId } = params;
    const answer = await Answer.findById(answerId).populate({
      path: "author",
      select: "_id clerkId name picture",
    });
    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: VoteAnswerParams) {
  try {
    connectToDatabase();
    const { answerId, userId, path } = params;

    const answer = await getAnswerById({ answerId });
    answer.upvotes.push(userId);
    answer.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function removeUpvoteAnswer(params: VoteAnswerParams) {
  try {
    connectToDatabase();
    const { answerId, userId, path } = params;

    const answer = await getAnswerById({ answerId });
    answer.upvotes.pull(userId);
    answer.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: VoteAnswerParams) {
  try {
    connectToDatabase();
    const { answerId, userId, path } = params;

    const answer = await getAnswerById({ answerId });
    answer.upvotes.push(userId);
    answer.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function removeDownvoteAnswer(params: VoteAnswerParams) {
  try {
    connectToDatabase();
    const { answerId, userId, path } = params;

    const answer = await getAnswerById({ answerId });
    answer.upvotes.pull(userId);
    answer.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
