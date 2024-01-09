import { z } from "zod";

const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(3).max(20)).min(1).max(5),
});

export default QuestionsSchema;
