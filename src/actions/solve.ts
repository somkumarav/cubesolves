"use server";
import { Solve } from "@prisma/client";
import { ServerActionReturnType } from "@/lib/api.types";
import { db } from "@/lib/prisma";
import { withSession } from "@/lib/session";
import { SuccessResponse } from "@/lib/success";
import { zodSafeParser } from "@/lib/zod-validator";
import { addSolveSchema } from "@/schemas/solve";
import { calculateFinalTime } from "@/lib/solve";

export const addSolve = withSession<
  addSolveSchema,
  ServerActionReturnType<Solve>
>(async (session, data) => {
  const validatedData = zodSafeParser(data, addSolveSchema);
  const finalTime = calculateFinalTime(
    validatedData.rawTime,
    validatedData.penalty
  );

  const solve = await db.solve.create({
    data: {
      ...validatedData,
      time: finalTime,
      userId: session.user!.id!,
    },
  });

  return new SuccessResponse("Solve added", 200, solve).serialize();
});
