import z from "zod";
import { CubeType, Solve } from "@prisma/client";

export const addSolveSessionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  cube: z.nativeEnum(CubeType),
});
export type AddSolveSession = z.infer<typeof addSolveSessionSchema>;

export const getSolveSessionSolvesSchema = z.object({
  solveSessionId: z.string(),
});
export type GetSolveSessionSolves = z.infer<typeof getSolveSessionSolvesSchema>;

export const getSolvesSchema = z.object({
  cursor: z.number().nullable(),
  solveSessionId: z.string().nullable()
})
export type GetSolves = z.infer<typeof getSolvesSchema>

export type SolvesPage = {
  items: Solve[];
  nextCursor: number | null;
  totalCount: number;
};

