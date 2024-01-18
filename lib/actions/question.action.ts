"use server";

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import {
  GetQuestionByIdParams,
  GetQuestionsParams,
  createQuestionParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { page, pageSize, sort } = params;
    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 }); // sort by createdAt descending
    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    console.log(questionId);
    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User });
    console.log(question);

    return { question };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: createQuestionParams) {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    const question = await Question.create({ title, content, author });
    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    //Create an interaction record for the user's ask_question
    // await User.findOneAndUpdate(
    //   { clerkId: author },
    //   {
    //     $push: {
    //       interactions: { type: "ask_question", question: question._id },
    //     },
    //   },
    //   { upsert: true, new: true }
    // );

    //Increment author's reputation by 5

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
