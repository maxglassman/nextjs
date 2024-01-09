import { Schema, model } from "mongoose";

interface Question {
  title: string;
  explanation: string;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

const QuestionSchema = new Schema<Question>({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 130,
  },
  explanation: {
    type: String,
    required: true,
    minlength: 20,
  },
  tags: {
    type: [String],
    required: true,
    minlength: 1,
    maxlength: 5,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const QuestionModel = model<Question>("Question", QuestionSchema);
export default QuestionModel;
