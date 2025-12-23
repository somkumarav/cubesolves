import { CubeType, SolveSession, UserSetting } from "@prisma/client";
import { db } from "@/lib/prisma";
import { withSession } from "@/lib/HOC/session";
import { ServerActionReturnType } from "@/lib/HOC/api.types";
import { SuccessResponse } from "@/lib/HOC/success";

type initializeUserSettingsReturnType = {
  userSettings: UserSetting;
  solveSession: SolveSession;
};

export const initializeUserSettings = withSession<
  void,
  ServerActionReturnType<initializeUserSettingsReturnType>
>(async (session) => {
  const userSettings = await db.userSetting.findFirst({
    where: { userId: session?.user?.id },
  });
  if (!userSettings) {
    const res = await db.$transaction(async (tx) => {
      const txSolveSession = await tx.solveSession.create({
        data: {
          name: "1",
          cube: CubeType.CUBE_33,
          userId: session.user!.id!,
        },
      });
      const txUserSetting = await tx.userSetting.create({
        data: {
          latestSolveSessionId: txSolveSession.id,
          userId: session.user!.id!,
        },
      });
      await tx.user.update({
        where: { id: session.user?.id },
        data: {
          emailVerified: new Date(),
        },
        include: {
          userSettings: true,
          solveSessions: true,
        },
      });
      return { userSettings: txUserSetting, solveSession: txSolveSession! };
    });
    return new SuccessResponse("Success", 200, res).serialize();
  }
  const solveSession = await db.solveSession.findFirst({
    where: {
      id: userSettings.latestSolveSessionId,
    },
  });
  return new SuccessResponse("Success", 200, {
    userSettings: userSettings,
    solveSession: solveSession!,
  }).serialize();
});
