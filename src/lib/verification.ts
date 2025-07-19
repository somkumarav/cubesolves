import { v4 } from "uuid";
import { db } from "@/lib/prisma";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = v4();
  const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }
  return await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
};
