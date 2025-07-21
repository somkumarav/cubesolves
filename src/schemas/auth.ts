import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string({ required_error: "username is required" })
    .min(2, "Username must be at least 2 characters")
    .max(32, "Username must be less than 32 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;

export const logInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
export type LogInSchema = z.infer<typeof logInSchema>;
