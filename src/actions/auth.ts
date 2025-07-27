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
import { withServerActionAsyncCatcher } from "@/lib/async-catcher";
import { ServerActionReturnType } from "@/lib/api.types";
import { ErrorHandler } from "@/lib/errors";
import { SuccessResponse } from "@/lib/success";
import { zodSafeParser } from "@/lib/zod-validator";
import {
  generateVerificationToken,
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from "@/lib/verification";
import { sendMail } from "@/lib/sendMail";
import { generateVerificationEmail } from "@/mails/verification-email";

export const Login = async (values: LogInSchema) => {
  const validatedFields = zodSafeParser(values, logInSchema);

  const existingUser = await db.user.findUnique({
    where: { email: validatedFields.email },
  });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials" };
  }
  const passwordMatch = await bcrypt.compare(
    validatedFields.password,
    existingUser.password
  );
  if (!passwordMatch) {
    return { error: "Invalid credentials" };
  }

  if (!existingUser.emailVerified) {
    console.log("Sending confirmation email to:", existingUser.email);
    const token = await generateVerificationToken(existingUser.email);
    await sendMail({
      to: existingUser.email,
      subject: "Email Confirmation",
      html: generateVerificationEmail(token.token),
    });
    return { success: "Confirmation email sent" };
  }

  try {
    await signIn("credentials", {
      email: validatedFields.email,
      password: validatedFields.password,
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
  await db.user.create({
    data: {
      email: formData.email,
      name: formData.name,
      password: hashedPassword,
    },
  });

  await getVerificationTokenByEmail(formData.email);

  return new SuccessResponse("Confirmation email sent", 200).serialize();
});

export const VerifyEmail = withServerActionAsyncCatcher<
  { token: string },
  ServerActionReturnType
>(async ({ token }) => {
  if (!token) {
    throw new ErrorHandler("Token is required", "VALIDATION_ERROR");
  }

  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    throw new ErrorHandler("Invalid token", "AUTHENTICATION_FAILED");
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) {
    throw new ErrorHandler("Token has expired", "AUTHENTICATION_FAILED");
  }

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    throw new ErrorHandler("User not found", "AUTHENTICATION_FAILED");
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return new SuccessResponse("Email verified", 200).serialize();
});
