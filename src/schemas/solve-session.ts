import z from "zod";
import { CubeType } from "@prisma/client";

export const createSolveSessionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  cube: z.nativeEnum(CubeType),
});

export type createSolveSession = z.infer<typeof createSolveSessionSchema>;
