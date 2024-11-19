import { z } from "zod";

export const contentSchema = z.object({
  content: z.string(),
});

export type Content = z.infer<typeof contentSchema>;
