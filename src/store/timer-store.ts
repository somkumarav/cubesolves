import { create } from "zustand";
import { generateScramble } from "@/lib/cube";
import { CubeType } from "@prisma/client";

interface TimerStore {
  scramble: string;
  displayTime: number;
  status: "ready" | "running" | "finished";
  startTime: number;
  intervalId: NodeJS.Timeout | null;

  initScramble: (cubeType: CubeType) => void;
  start: () => void;
  stop: () => { time: number; scramble: string };
  reset: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  scramble: "",
  displayTime: 0,
  status: "ready",
  startTime: 0,
  intervalId: null,

  initScramble: (cubeType) => {
    set({ scramble: generateScramble(cubeType) });
  },

  start: () => {
    const start = Date.now();
    const id = setInterval(() => {
      set({ displayTime: Date.now() - start });
    }, 10);
    set({ status: "running", startTime: start, intervalId: id });
  },

  stop: () => {
    const state = get();
    if (state.intervalId) clearInterval(state.intervalId);
    set({ status: "finished", intervalId: null });

    return { time: state.displayTime, scramble: state.scramble };
  },

  reset: () => set({ displayTime: 0, status: "ready" }),
}));
