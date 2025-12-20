import { PenaltyType } from "@prisma/client";

export function calculateFinalTime(
  rawTime: number,
  penalty: PenaltyType
): number {
  switch (penalty) {
    case PenaltyType.PLUS_TWO:
      return rawTime + 2000;
    case PenaltyType.DNF:
      return -1;
    case PenaltyType.NONE:
    default:
      return rawTime;
  }
}
