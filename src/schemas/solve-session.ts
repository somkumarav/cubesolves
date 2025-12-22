import z from "zod";
import { CubeType } from "@prisma/client";

export const addSolveSessionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  cube: z.nativeEnum(CubeType),
});
export type AddSolveSession = z.infer<typeof addSolveSessionSchema>;

export const getSolveSessionSchema = z.object({
  solveSessionId: z.string(),
});

export type GetSolveSession = z.infer<typeof getSolveSessionSchema>;
