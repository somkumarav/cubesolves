"use server";
import { Solve } from "@prisma/client";
import { ServerActionReturnType } from "@/lib/HOC/api.types";
import { db } from "@/lib/prisma";
import { withSession } from "@/lib/HOC/session";
import { SuccessResponse } from "@/lib/HOC/success";
import { zodSafeParser } from "@/lib/zod-validator";
import { addSolveSchema } from "@/schemas/solve";
import { calculateFinalTime } from "@/lib/solve";
import { ErrorHandler } from "../lib/HOC/errors";

export const addSolve = withSession<
  addSolveSchema,
  ServerActionReturnType<Solve>
>(async (session, data) => {
  try {
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
  } catch (error) {
    console.error("Error in addSolve action", error);
    return new ErrorHandler("Solve not saved", "BAD_REQUEST");
  }
});
