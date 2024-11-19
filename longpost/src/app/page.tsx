"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus, removeAuthToken } from '~/lib/utils/auth';
import { default as Editor } from '~/components/editor/editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import { z } from "zod"
// import { toast } from "@/components/hooks/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Content, contentSchema } from '~/lib/types/editor';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';


export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = checkAuthStatus();

  useEffect(() => {
    if (!isAuthenticated) {
      console.error('Not authenticated please login first')
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    removeAuthToken();
    console.log('Logged out successfuly')
    router.push('/login');
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
  console.log(form)

  async function onSubmit(values: Content) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    console.log(formData)

    try {
      // console.log(values)
      const values = contentSchema.parse(Object.fromEntries(formData.entries()))
      // await editPost(formData);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {/* <Editor>{content}</Editor> */}
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
                  <FormLabel>Enter your post</FormLabel>
                  <FormControl>
                    <Editor
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
