"use server";

import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTagsParams(
  params: GetTopInteractedTagsParams
) {
  try {
    connectToDatabase();

    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // Find interactions for the user and group by tags...
    // Interaction...

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 24, searchQuery, filter } = params;

    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        // sort by length of questions
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query).sort(sortOptions);

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPopularTags(params: {
  page: number;
  pageSize: number;
  limit: number;
}) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 5, limit = 5 } = params;

    const tags = await Tag.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: { $size: "$questions" },
        },
      },
      { $sort: { totalQuestions: -1 } },
      { $limit: limit },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ]);

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
