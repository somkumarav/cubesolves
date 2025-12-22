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
import { withServerActionAsyncCatcher } from "@/lib/HOC/async-catcher";
import { ServerActionReturnType } from "@/lib/HOC/api.types";
import { ErrorHandler } from "@/lib/HOC/errors";
import { SuccessResponse } from "@/lib/HOC/success";
import { zodSafeParser } from "@/lib/zod-validator";
import {
  generateVerificationToken,
  getVerificationTokenByToken,
} from "@/lib/verification";
import { sendMail } from "@/lib/sendMail";
import { generateVerificationEmail } from "@/mails/verification-email";
import { CubeType } from "@prisma/client";

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

  const token = await generateVerificationToken(formData.email);
  await sendMail({
    to: formData.email,
    subject: "Email Confirmation",
    html: generateVerificationEmail(token.token),
  });

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

  await db.$transaction(async (tx) => {
    const session = await tx.solveSession.create({
      data: {
        name: "1",
        cube: CubeType.CUBE_33,
        userId: existingUser.id!,
      },
    });

    await tx.userSetting.create({
      data: {
        latestSolveSessionId: session.id,
        userId: existingUser.id,
      },
    });

    const updatedUser = await tx.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
      },
      include: {
        userSettings: true,
        solveSessions: true,
      },
    });

    return updatedUser;
  });

  return new SuccessResponse("Email verified", 200).serialize();
});
