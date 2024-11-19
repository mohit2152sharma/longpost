"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuthStatus, removeAuthToken } from "~/lib/auth";
import { default as Editor } from "~/components/editor/editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Content, contentSchema } from "~/components/editor/editor-types";
import LoadingBtn from "~/components/loading-button";
import { bskyThreads } from "~/lib/post";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = checkAuthStatus();

  useEffect(() => {
    if (!isAuthenticated) {
      console.error("Not authenticated please login first");
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    removeAuthToken();
    console.log("Logged out successfuly");
    router.push("/login");
  };

  const form = useForm<Content>({
    resolver: zodResolver(contentSchema),
    defaultValues: { content: "" },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: Content) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    const parsedValues = contentSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") as string,
    );
    const response = await bskyThreads(
      "https://bsky.social",
      sessionData,
      parsedValues.content,
    );
    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success("Post created successfully");
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold p-2">Longpost</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <p className="text-lg p-2">
          Convert your long posts into threads. Paste in your text, it can be
          greater than bluesky&apos;s character limit (300), the site will split
          the text into a series of post and then post them on bluesky.
        </p>
        <Form {...form}>
          <form
            className="space-y-6 p-2"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingBtn type="submit" loading={isSubmitting}>
              Submit
            </LoadingBtn>
          </form>
        </Form>
      </div>
      <div>
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}