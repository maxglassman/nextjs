"use client";
import React, { useRef, useState } from "react";
import mongoose from "mongoose";
import { Form, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AnswersSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { createAnswer } from "@/lib/actions/answer.action";

//TODO: Remove text from editor after submitting.
const type: any = "create";

interface AnswerProps {
  mongoUser: string;
  question: string;
}

const Answer = ({ mongoUser, question }: AnswerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();

  const path = usePathname();
  const editorRef = useRef<Editor | null>(null);
  const form = useForm<z.infer<typeof AnswersSchema>>({
    resolver: zodResolver(AnswersSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AnswersSchema>) {
    try {
      setIsSubmitting(true);
      const questionObject = await JSON.parse(question);
      await createAnswer({
        content: values.content,
        author: JSON.parse(mongoUser),
        question: questionObject,
        path: path,
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <div className="flex justify-between items-center mt-4">
                <FormLabel className="base-bold text-dark400_light800">
                  Write your answer here
                </FormLabel>
                <Link href="">
                  <Button className="background-light800_dark300 border light-border-1 rounded gap-1">
                    <Image
                      src="/assets/icons/frame.svg"
                      alt="ai"
                      width={12}
                      height={12}
                    />
                    <p className="paragraph-semibold text-primary-500">
                      Generate AI Answer
                    </p>
                  </Button>
                </Link>
              </div>

              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  //@ts-ignore
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "codesample",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter |" +
                      "alignright alignjustify | bullist numlist",
                    content_style: "body { font-family:Inter; font-size:14px }",
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-4 primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "edit" ? "Editing..." : "Posting"}</>
          ) : (
            <>{type === "edit" ? "Edit Answer" : "Post Answer"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Answer;
