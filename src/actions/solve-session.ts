"use server";
import { Solve, SolveSession } from "@prisma/client";
import { ServerActionReturnType } from "@/lib/HOC/api.types";
import { withSession } from "@/lib/HOC/session";
import { SuccessResponse } from "@/lib/HOC/success";
import { zodSafeParser } from "@/lib/zod-validator";
import {
  AddSolveSession,
  addSolveSessionSchema,
  GetSolves,
  GetSolveSessionSolves,
  getSolveSessionSolvesSchema,
  getSolvesSchema,
  SolvesPage,
} from "@/schemas/solve-session";
import { db } from "@/lib/prisma";
import { generateDefaultSessionName } from "@/lib/solve-session";
import { ErrorHandler } from "@/lib/HOC/errors";

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

export const getAllSolveSession = withSession<
  void,
  ServerActionReturnType<SolveSession[]>
>(async (session) => {
  const solveSession = await db.solveSession.findMany({
    where: {
      userId: session.user?.id,
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

export const getSolveSessionSolves = withSession<
  GetSolveSessionSolves,
  ServerActionReturnType<SolveSession & { solves: Solve[] }>
>(async (session, data) => {
  const validatedData = zodSafeParser(data, getSolveSessionSolvesSchema);

  const solveSession = await db.solveSession.findFirst({
    where: {
      id: validatedData.solveSessionId,
      userId: session.user?.id,
    },
    include: {
      solves: {
        orderBy: {
          id: "desc",
        },
      },
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

export const getLastFiveSolve = withSession<
  GetSolveSessionSolves,
  ServerActionReturnType<Solve[]>
>(async (session, data) => {
  const validatedData = zodSafeParser(data, getSolveSessionSolvesSchema);

  const solveSession = await db.solveSession.findFirst({
    where: {
      id: validatedData.solveSessionId,
      userId: session.user?.id,
    },
    include: {
      solves: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!solveSession) {
    throw new ErrorHandler("Solve session not found", "NOT_FOUND");
  }

  return new SuccessResponse(
    "Solve session found",
    200,
    solveSession.solves
  ).serialize();
});

const PAGE_SIZE = 20
export const getSolves = withSession<
  GetSolves,
  ServerActionReturnType<SolvesPage>
>(async (session, data) => {
  const validatedData = zodSafeParser(data, getSolvesSchema);
  if(!session.user) return new ErrorHandler("User not logged in", 'UNAUTHORIZED')

  const rows = await db.solve.findMany({
    take: PAGE_SIZE + 1,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    ...(validatedData.cursor && { cursor: { id: validatedData.cursor }, skip: 1 }),
    where: {
      userId: session.user?.id,
      deletedAt: null,
      ...(validatedData.solveSessionId && { solveSessionId: validatedData.solveSessionId }),
    },
  });

  let nextCursor: number | null = null;
  if (rows.length > PAGE_SIZE) {
    const next = rows.pop()!;
    nextCursor = next.id;
  }

  const totalCount = await db.solve.count({
    where: { deletedAt: null },
  });

  return new SuccessResponse("Succesfully fetched solves",
    200,
    { items: rows, nextCursor, totalCount }
  ).serialize()
});


