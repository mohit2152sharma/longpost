import { z } from 'zod';

export const contentSchema = z.object({
	content: z.string(),
	shoutout: z.boolean().default(true)
});

export type Content = z.infer<typeof contentSchema>;
