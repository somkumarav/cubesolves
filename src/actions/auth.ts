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

export const SignUp = async (values: SignUpSchema) => {
  const validatedFields = signUpSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields);
    return { msg: "invalid fields", data: validatedFields.error };
  }
  const formData = validatedFields.data;

  const userAlreadyExists = await db.user.findUnique({
    where: { email: formData.email },
  });

  if (userAlreadyExists) {
    return { msg: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(formData.password, 10);
  const dbUser = await db.user.create({
    data: {
      email: formData.email,
      name: formData.name,
      password: hashedPassword,
    },
  });
  const { password, ...restOfUser } = dbUser;

  return { msg: "Sign up successful", data: { ...restOfUser } };
};
