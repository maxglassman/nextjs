"use server";

import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";

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

    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 24, searchQuery, filter } = params;

    const tags = await Tag.find({}).sort({ createdAt: -1 });

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
