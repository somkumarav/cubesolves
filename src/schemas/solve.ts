import z from "zod";
import { CubeType, PenaltyType } from "@prisma/client";

export const addSolveSchema = z.object({
  scramble: z.string().min(1).max(500),
  cube: z.nativeEnum(CubeType),
  rawTime: z.number().int().positive(),
  penalty: z.nativeEnum(PenaltyType).default(PenaltyType.NONE),
  note: z.string().max(500).optional(),
  solveSessionId: z.string().optional(),
});
export type addSolveSchema = z.infer<typeof addSolveSchema>;
