"use server";

import Tag, { ITag } from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import {
  GetQuestionByIdParams,
  GetQuestionsParams,
  createQuestionParams,
  VoteQuestionParams,
  SavedQuestionsParams,
  GetQuestionsByTagIdParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { get } from "http";
import { FilterQuery } from "mongoose";

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
    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User });

    return question;
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

export async function upvoteQuestion(params: VoteQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, userId, path } = params;
    const question = await getQuestionById({ questionId });

    if (question.upvotes.includes(userId)) {
      question.upvotes.pull(userId);
    } else {
      question.upvotes.push(userId);
    }

    if (question.downvotes.includes(userId)) {
      question.downvotes.pull(userId);
    }

    question.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: VoteQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, userId, path } = params;
    console.log(params);

    const question = await getQuestionById({ questionId });
    if (question.downvotes.includes(userId)) {
      question.downvotes.pull(userId);
    } else {
      question.downvotes.push(userId);
    }

    if (question.upvotes.includes(userId)) {
      question.upvotes.pull(userId);
    }

    question.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: SavedQuestionsParams) {
  const { userId, page = 1, pageSize = 24, searchQuery } = params;

  const query: FilterQuery<typeof Question> = searchQuery
    ? { title: { $regex: new RegExp(searchQuery, "i") } }
    : {};
  try {
    const user = await User.findById(userId).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    const saveQuestions = user.saved;

    return { questions: saveQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTag(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: new RegExp(searchQuery, "i") } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    const tagQuestions = tag.questions;

    return { tagTitle: tag.name, tagQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
