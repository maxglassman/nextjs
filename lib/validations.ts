import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(3).max(20)).min(1).max(5),
});

export const AnswersSchema = z.object({
  content: z.string().min(20),
});

export const UserSchema = z.object({
  name: z.string().min(3).max(20),
  username: z.string().min(3).max(20),
  portfolioWebsite: z.string().url(),
  location: z.string().min(3).max(20),
  bio: z.string().min(20).max(200),
});
