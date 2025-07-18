"use server";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { db } from "@/lib/prisma";
import {
  logInSchema,
  LogInSchema,
  signUpSchema,
  SignUpSchema,
} from "@/schemas/auth";
import { withServerActionAsyncCatcher } from "../lib/async-catcher";
import { ServerActionReturnType } from "@/lib/api.types";
import { ErrorHandler } from "../lib/errors";
import { SuccessResponse } from "../lib/success";
import { zodSafeParser } from "../lib/zod-valildator";

export const Login = async (values: LogInSchema) => {
  const validatedFields = logInSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields);
    return { msg: "invalid fields", data: validatedFields.error };
  }

  try {
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { msg: "Invalid credentials" };
        default:
          return { msg: "An unexpected error occurred during login" };
      }
    }
    throw error;
  }

  return { msg: "Login successful" };
};

export const SignUp = withServerActionAsyncCatcher<
  SignUpSchema,
  ServerActionReturnType
>(async (values: SignUpSchema) => {
  const formData = zodSafeParser(values, signUpSchema);

  const userAlreadyExists = await db.user.findUnique({
    where: { email: formData.email },
  });

  if (userAlreadyExists) {
    throw new ErrorHandler("User already exists", "AUTHENTICATION_FAILED");
  }

  const hashedPassword = await bcrypt.hash(formData.password, 10);
  const user = await db.user.create({
    data: {
      email: formData.email,
      name: formData.name,
      password: hashedPassword,
    },
  });

  return new SuccessResponse(
    "User created successfully",
    200,
    user
  ).serialize();
});
