import { CubeType } from "@prisma/client";

export function generateDefaultSessionName(cube: CubeType): string {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${CubeType[cube]} - ${date} ${time}`;
}
