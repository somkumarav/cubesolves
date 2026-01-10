import { create } from "zustand";
import { generateScramble } from "@/lib/cube";
import { CubeType, Solve, SolveSession } from "@prisma/client";
import { getLastFiveSolve } from "../actions/solve-session";

interface TimerStore {
  scramble: string;
  displayTime: number;
  status: "ready" | "running" | "finished";
  startTime: number;
  intervalId: NodeJS.Timeout | null;
  lastFiveSolves: Solve[];

  init: (solveSession: SolveSession) => void;
  refreshScramble: (cubeType: CubeType) => void;
  addToLastFiveSolve: (solve: Solve) => void;
  updataLastFiveSolve: (solve: Solve) => void;
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
  lastFiveSolves: [],

  init: async (solveSession) => {
    const newScramble = generateScramble(solveSession.cube);

    const lastFiveData = await getLastFiveSolve({
      solveSessionId: solveSession.id,
    });

    const solvesArray =
      lastFiveData.status && lastFiveData.additional
        ? lastFiveData.additional
        : [];

    set({
      scramble: newScramble,
      lastFiveSolves: solvesArray.reverse(),
    });
  },

  refreshScramble: (cubeType) => {
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

  addToLastFiveSolve: (newSolve: Solve) => {
    const state = get();
    set({
      lastFiveSolves: [...state.lastFiveSolves.slice(-4), newSolve],
    });
  },
  updataLastFiveSolve: (updatedSolve: Solve) => {
    const state = get();
    set({
      displayTime: state.displayTime + 2000,
      lastFiveSolves: state.lastFiveSolves.map((solve) =>
        solve.id === updatedSolve.id ? updatedSolve : solve
      ),
    });
  },
}));
