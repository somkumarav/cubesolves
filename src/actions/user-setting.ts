"use server";
import { UserSetting } from "@prisma/client";
import { ServerActionReturnType } from "@/lib/api.types";
import { db } from "@/lib/prisma";
import { withSession } from "@/lib/session";
import { SuccessResponse } from "@/lib/success";
import { ErrorHandler } from "@/lib/errors";

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
