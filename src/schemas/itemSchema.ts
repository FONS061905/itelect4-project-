import { z } from "zod";

export const itemSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .refine((v) => v.trim().length > 0, "Title can't be just spaces."),
  type: z.enum(["lost", "found"]),
  location: z.string().min(1, "Location is required."),
  reporterId: z.string().min(1, "Choose a reporter."),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
