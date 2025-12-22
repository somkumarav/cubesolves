"use server";
import { UserSetting } from "@prisma/client";
import { ServerActionReturnType } from "@/lib/HOC/api.types";
import { db } from "@/lib/prisma";
import { SuccessResponse } from "@/lib/HOC/success";
import { ErrorHandler } from "@/lib/HOC/errors";
import { withSession } from "@/lib/HOC/session";

export const getUserSetting = withSession<
  void,
  ServerActionReturnType<UserSetting>
>(async (session) => {
  const userSetting = await db.userSetting.findUnique({
    where: {
      userId: session.user!.id,
    },
  });

  if (!userSetting) {
    throw new ErrorHandler("Settings not found", "NOT_FOUND");
  }

  return new SuccessResponse("User setting", 200, userSetting).serialize();
});
