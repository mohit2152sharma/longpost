import { z } from "zod";


export const contentSchema = z.object({
    content: z.string()
    // title: z.string().min(2, {
    //     message: "Title must be at least 2 characters.",
    //   }),
    //   description: z.string().min(50, {
    //     message: "description must be at least 50 characters.",
    //   }),
    //   id: z.string().optional()
  });
  
  
  
  export type Content = z.infer<typeof contentSchema>;
