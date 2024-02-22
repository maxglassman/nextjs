"use server";

import { getQuestions } from "./question.action";
import { getAllTags } from "./tag.action";
import { getAnswers } from "./answer.action";
import { getAllUsers } from "./user.action";

export async function getGlobalSearch(params: { searchQuery: string }) {
  try {
    const { searchQuery } = params;
    console.log("searchQuery", searchQuery);

    const [questions, answers, users, tags] = await Promise.all([
      getQuestions({ page: 1, pageSize: 2, searchQuery: searchQuery }),
      getAnswers({ page: 1, pageSize: 2, searchQuery: searchQuery }),
      getAllUsers({ page: 1, pageSize: 2, searchQuery: searchQuery }),
      getAllTags({ page: 1, pageSize: 2, searchQuery: searchQuery }),
    ]);

    // with questions, answers, users, and tags, create a list of objects with type, title (question: title, answer: content, user: name, tags: name), and id
    const result = [
      ...questions.questions.map((question) => ({
        type: "question",
        title: question.title,
        id: question._id.toString(),
      })),
      ...answers.map((answer) => ({
        type: "answer",
        // parse the content to remove html tags
        title: answer.content.replace(/<[^>]*>/g, ""),
        id: answer._id.toString(),
      })),
      ...users.map((user) => ({
        type: "user",
        title: user.name,
        id: user.clerkId,
      })),
      ...tags.map((tag) => ({
        type: "tags",
        title: tag.name,
        id: tag._id.toString(),
      })),
    ];
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
