import { CubeType } from "@prisma/client";

const MOVES = {
  CUBE_22: [
    "R",
    "R'",
    "R2",
    "U",
    "U'",
    "U2",
    "F",
    "F'",
    "F2",
    "L",
    "L'",
    "L2",
    "B",
    "B'",
    "B2",
    "D",
    "D'",
    "D2",
  ],
  CUBE_33: [
    "R",
    "R'",
    "R2",
    "U",
    "U'",
    "U2",
    "F",
    "F'",
    "F2",
    "L",
    "L'",
    "L2",
    "B",
    "B'",
    "B2",
    "D",
    "D'",
    "D2",
  ],
  CUBE_44: [
    "R",
    "R'",
    "R2",
    "Rw",
    "Rw'",
    "Rw2",
    "U",
    "U'",
    "U2",
    "Uw",
    "Uw'",
    "Uw2",
    "F",
    "F'",
    "F2",
    "Fw",
    "Fw'",
    "Fw2",
    "L",
    "L'",
    "L2",
    "Lw",
    "Lw'",
    "Lw2",
    "B",
    "B'",
    "B2",
    "Bw",
    "Bw'",
    "Bw2",
    "D",
    "D'",
    "D2",
    "Dw",
    "Dw'",
    "Dw2",
  ],
};
export const scrambleLengthMap = { CUBE_22: 10, CUBE_33: 20, CUBE_44: 40 };

export function generateScramble(cubeType: CubeType): string {
  const moves = MOVES.CUBE_33;
  if (!moves) throw new Error(`Unsupported cube type: ${cubeType}`);

  const scrambleLength = scrambleLengthMap[cubeType];

  const scramble: string[] = [];
  let lastFace = "";

  for (let i = 0; i < scrambleLength; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (lastFace === move[0]);

    scramble.push(move);
    lastFace = move[0];
  }

  return scramble.join(" ");
}
