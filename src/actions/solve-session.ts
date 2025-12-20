"use server";
import { SolveSession } from "@prisma/client";
import { ServerActionReturnType } from "@/lib/api.types";
import { withSession } from "@/lib/session";
import { SuccessResponse } from "@/lib/success";
import { zodSafeParser } from "@/lib/zod-validator";
import {
  createSolveSession,
  createSolveSessionSchema,
} from "@/schemas/solve-session";
import { db } from "@/lib/prisma";
import { generateDefaultSessionName } from "@/lib/solve-session";

export const addSolveSession = withSession<
  createSolveSession,
  ServerActionReturnType<SolveSession>
>(async (session, data) => {
  const validatedData = zodSafeParser(data, createSolveSessionSchema);

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
