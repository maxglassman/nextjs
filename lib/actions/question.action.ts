"use server";

import Tag, { ITag } from "@/database/tag.model";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import {
  GetQuestionByIdParams,
  GetQuestionsParams,
  createQuestionParams,
  VoteQuestionParams,
  SavedQuestionsParams,
  GetQuestionsByTagIdParams,
  GetQuestionsByUserIdParams,
  DeleteQuestionParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import { skip } from "node:test";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 10, sort, searchQuery, filter } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const totalQuestions = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions); // sort by createdAt descending

    const moreQuestions = totalQuestions > skipAmount + questions.length;

    return { questions, moreQuestions };
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
      $addToSet: { tags: { $each: tagDocuments } },
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

export async function getQuestionsByUserId(params: GetQuestionsByUserIdParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10, searchQuery } = params;

    const totalQuestions = await Question.countDocuments({ userId });

    const query: { userId: string; title?: object } = { userId };
    if (searchQuery) {
      query.title = { $regex: new RegExp(searchQuery, "i") };
    }

    const userQuestions = await Question.find(query)
      .sort({ views: -1, upvotes: -1 })
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User });
    // .skip((page - 1) * pageSize)
    // .limit(pageSize);

    return userQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  //create a try catch block that connects to the database and deletes the questionId and calls deleteAnswer() to delete all answers associated with the questionId.
  try {
    connectToDatabase();
    const { questionId, path } = params;

    // Assuming you're using Mongoose with a Question model and delete all answers associated with the questionId
    await Promise.all([
      Question.deleteOne({ _id: questionId }),
      Answer.deleteMany({ question: questionId }),
      Interaction.deleteMany({ question: questionId }),
      Tag.updateMany(
        { questions: questionId },
        { $pull: { questions: questionId } }
      ),
    ]);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateQuestion(params: {
  questionId: string;
  title: string;
  content: string;
  tags: string[];
  path: string;
}) {
  try {
    connectToDatabase();
    const { questionId, title, content, tags, path } = params;

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: questionId } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag);
    }

    await Question.findByIdAndUpdate(questionId, {
      $set: { title, content },
      $addToSet: { tags: { $each: tagDocuments } },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions(params: {
  page: number;
  pageSize: number;
}) {
  try {
    connectToDatabase();
    const { page, pageSize } = params;
    const questions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
