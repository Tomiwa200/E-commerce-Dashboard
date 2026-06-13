import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please provide a valid email format."),
  password: z.string().min(6, "Password must contain at least 6 characters."),
});

export const signupSchema = loginSchema.extend({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
