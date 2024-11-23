"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuthStatus, removeAuthToken } from "~/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Content, contentSchema } from "~/components/editor/editor-types";
import LoadingBtn from "~/components/loading-button";
import { bskyThreads } from "~/lib/post";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";

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
    defaultValues: { content: "", shoutout: true },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: Content) {
    const parsedValues = contentSchema.parse(values);
    console.log(parsedValues);

    const sessionData = JSON.parse(
      sessionStorage.getItem("sessionData") as string,
    );
    const response = await bskyThreads(
      "https://bsky.social",
      sessionData,
      parsedValues,
    );
    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success("Post created successfully");
    }
  }

  return (
    <div className="h-full p-8">
      <div className="max-w-4xl mx-auto h-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold p-2 self-center">Longpost</h1>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <a
                href="https://ko-fi.com/montepy"
                target="_blank"
                rel="noreferrer"
              >
                Support me
              </a>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="text-lg font-bold p-2">
          Convert your long posts into threads.
        </p>
        <div className="p-2 space-y-0">
          <p>
            Paste in your text, it can be greater than bluesky&apos;s character
            limit (300).
          </p>{" "}
          <p>
            The site will split the text into a series of post and then post
            them on bluesky.
          </p>
        </div>
        <Form {...form}>
          <form
            className="space-y-6 p-2 h-1/4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormControl className="border border-pink">
                    <Textarea className="h-full" {...field} />
                    {/* NOTE: Not using rich editor now as bsky doesn't have support for bold/italics formatting */}
                    {/* <Editor onChange={field.onChange} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row items-center space-x-4">
              <LoadingBtn type="submit" loading={isSubmitting}>
                Submit
              </LoadingBtn>
              <FormField
                control={control}
                name="shoutout"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-center items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-center pb-2 justify-center items-center font-light text-sm italic">
                      Add &quot;created by Longpost&quot; to the end of your
                      post
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div>
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}
