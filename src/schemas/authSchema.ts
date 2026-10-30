import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("That is not an email address."),
  // The backend's User schema has minlength: 8, so a shorter password
  // would be refused anyway -- this shows the message where it's typed.
  password: z.string().min(8, "At least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Register needs the same email and password, plus a name.
export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(1, "Your name is required.")
    .refine((v) => v.trim().length > 0, "Name can't be just spaces."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
