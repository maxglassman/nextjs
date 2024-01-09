"use server";

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";

export async function createQuestion(params: any) {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    console.log(tags);
    console.log(typeof tags);
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

    //Increment author's reputation by 5
  } catch (error) {
    console.log(error);
  }
}
