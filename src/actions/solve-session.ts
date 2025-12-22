"use server";
import { SolveSession } from "@prisma/client";
import { ServerActionReturnType } from "@/lib/HOC/api.types";
import { withSession } from "@/lib/HOC/session";
import { SuccessResponse } from "@/lib/HOC/success";
import { zodSafeParser } from "@/lib/zod-validator";
import {
  AddSolveSession,
  addSolveSessionSchema,
  GetSolveSession,
  getSolveSessionSchema,
} from "@/schemas/solve-session";
import { db } from "@/lib/prisma";
import { generateDefaultSessionName } from "@/lib/solve-session";
import { ErrorHandler } from "../lib/HOC/errors";

export const addSolveSession = withSession<
  AddSolveSession,
  ServerActionReturnType<SolveSession>
>(async (session, data) => {
  const validatedData = zodSafeParser(data, addSolveSessionSchema);

  const sessionName =
    validatedData.name || generateDefaultSessionName(validatedData.cube);

  const newSolveSession = await db.solveSession.create({
    data: {
      name: sessionName,
      cube: validatedData.cube,
      userId: session.user!.id!,
    },
    include: {
      _count: {
        select: { solves: true },
      },
    },
  });

  return new SuccessResponse("Solve added", 200, newSolveSession).serialize();
});

export const getSolveSession = withSession<
  GetSolveSession,
  ServerActionReturnType<SolveSession>
>(async (session, data) => {
  const validatedData = zodSafeParser(data, getSolveSessionSchema);

  const solveSession = await db.solveSession.findFirst({
    where: {
      id: validatedData.solveSessionId,
      userId: session.user?.id,
    },
    include: {
      solves: true,
    },
  });

  if (!solveSession) {
    throw new ErrorHandler("Solve session not found", "NOT_FOUND");
  }

  return new SuccessResponse(
    "Solve session found",
    200,
    solveSession
  ).serialize();
});
