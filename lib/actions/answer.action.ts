"use server";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import {
  CreateAnswerParams,
  GetAnswersParams,
  GetAnswerParams,
  VoteAnswerParams,
  GetAnswersByUserIdParams,
  DeleteAnswerParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

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
    const { page = 1, pageSize = 10, questionId, filter, searchQuery } = params;

    const query: FilterQuery<typeof Answer> = {};

    const skipAmount = (page - 1) * pageSize;

    if (questionId) {
      query.question = questionId;
    }

    if (searchQuery) {
      query.$or = [{ content: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};
    switch (filter) {
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "higestupvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowesstupvotes":
        sortOptions = { upvotes: 1 };
        break;
      default:
        break;
    }
    const answers = await Answer.find(query)
      .populate({
        path: "author",
        select: "_id clerkId name picture",
      })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

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

    if (answer.upvotes.includes(userId)) {
      answer.upvotes.pull(userId);
    } else {
      answer.upvotes.push(userId);
    }

    if (answer.downvotes.includes(userId)) {
      answer.downvotes.pull(userId);
    }

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
    console.log(params);

    const answer = await getAnswerById({ answerId });
    if (answer.downvotes.includes(userId)) {
      answer.downvotes.pull(userId);
    } else {
      answer.downvotes.push(userId);
    }

    if (answer.upvotes.includes(userId)) {
      answer.upvotes.pull(userId);
    }

    answer.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswersByUserId(params: GetAnswersByUserIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const answers = await Answer.find({ author: userId })
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

export async function deleteAnswer(params: DeleteAnswerParams) {
  //create a try catch block that connects to the database and deletes the questionId and calls deleteAnswer() to delete all answers associated with the questionId.
  try {
    connectToDatabase();
    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Assuming you're using Mongoose with a Question model and delete all answers associated with the questionId
    await Promise.all([
      Answer.deleteOne({ _id: answerId }),
      Question.updateOne(
        { _id: answer.question },
        { $pull: { answers: answerId } }
      ),
      Interaction.deleteMany({ answer: answerId }),
    ]);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
