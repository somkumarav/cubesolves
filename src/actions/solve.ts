"use server";
import { Solve } from "@prisma/client";
import { ServerActionReturnType } from "@/lib/HOC/api.types";
import { db } from "@/lib/prisma";
import { withSession } from "@/lib/HOC/session";
import { SuccessResponse } from "@/lib/HOC/success";
import { zodSafeParser } from "@/lib/zod-validator";
import { calculateFinalTime } from "@/lib/solve";
import { ErrorHandler } from "../lib/HOC/errors";
import {
  AddSolve,
  addSolveSchema,
  PlusTwo,
  plusTwoSchema,
} from "../schemas/solve";

export const addSolve = withSession<AddSolve, ServerActionReturnType<Solve>>(
  async (session, data) => {
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
  }
);

export const plusTwo = withSession<PlusTwo, ServerActionReturnType<Solve>>(
  async (session, data) => {
    try {
      const validatedData = zodSafeParser(data, plusTwoSchema);
      const solve = await db.solve.findFirst({
        where: {
          id: validatedData.id,
          userId: session.user?.id,
        },
      });
      if (!solve) {
        return new ErrorHandler("Solve not found", "BAD_REQUEST");
      }

      const finalTime = solve.time + 2000;

      const updatedSolve = await db.solve.update({
        where: {
          id: validatedData.id,
        },
        data: {
          penalty: "PLUS_TWO",
          time: finalTime,
        },
      });

      return new SuccessResponse("Solve added", 200, updatedSolve).serialize();
    } catch (error) {
      console.error("Error in addSolve action", error);
      return new ErrorHandler("Solve not updated", "BAD_REQUEST");
    }
  }
);
