"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserStatsParams,
  UpdateUserParams,
  UserSaveQuestionParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import mongoose, { FilterQuery } from "mongoose";
import { removeSpecialCharacters } from "../utils";

export async function getUserByClerkId(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export //create an async function called getUsers that takes in a parameter called params of type GetAllUsersParams, and returns a Promise of type User[]. The function should apply the params to the User.find() query if params are not null, and return the result.
async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 24, searchQuery, filter } = params;

    const query: FilterQuery<typeof User> = {};
    const skipAmount = (page - 1) * pageSize;

    if (searchQuery) {
      const cleanSearchQuery = removeSpecialCharacters(searchQuery);
      query.$or = [
        { name: { $regex: new RegExp(cleanSearchQuery, "i") } },
        { username: { $regex: new RegExp(cleanSearchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { createdAt: -1 };
        break;
      case "old_users":
        sortOptions = { createdAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = userData;

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
    return updatedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(userData: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = userData;

    const user = await User.findOne({ clerkId: clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    //need to delete all questions, answers, comments etc. by this user

    const userQuestionIds = await Question.find({
      author: user._id,
    }).distinct("_id");

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;

    //TODO: delete all answers, comments, etc. by this user
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function userSaveQuestion(params: UserSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId } = params;

    const questionObjectId = new mongoose.Types.ObjectId(questionId);

    const user = await User.findOne({ _id: userId });

    const isSaved = user.saved.includes(questionObjectId);

    if (isSaved) {
      user.saved.pull(questionObjectId);
    } else {
      user.saved.push(questionObjectId);
    }
    user.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserStats(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    //create a query that returns the number of questions and answers for a given userId.
    const { userId } = params;

    const [questionCount, answerCount] = await Promise.all([
      Question.countDocuments({ author: JSON.parse(userId) }),
      Answer.countDocuments({ author: JSON.parse(userId) }),
    ]);

    return {
      questionCount,
      answerCount,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
