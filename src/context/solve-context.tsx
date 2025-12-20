"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { generateScramble } from "@/lib/cube";
import { addSolve } from "@/actions/solve";
import { CubeType, PenaltyType } from "@prisma/client";
import { getUserSetting } from "@/actions/user-setting";

interface SolveContextType {
  scramble: string;
  time: string;
}

const SolveContext = createContext<SolveContextType | undefined>(undefined);

export const SolveProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayTime, setDisplayTime] = useState(0);
  const [status, setStatus] = useState<"ready" | "running" | "finished">(
    "ready"
  );
  const [currentSolveSession, setCurrentSolveSession] = useState("1");
  const [cube, setCube] = useState<CubeType>("CUBE_33");
  const [scramble, setScramble] = useState(generateScramble(cube));
  const [penalty, setPenalty] = useState<PenaltyType>("NONE");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const currentScrambleRef = useRef(scramble);

  useEffect(() => {
    const initializeUserSetting = async () => {
      const res = await getUserSetting();
      if (res.status) {
        setCurrentSolveSession(res.additional!.currentSolveSessionId!);
      }
    };
    initializeUserSetting();
  }, []);

  useEffect(() => {
    currentScrambleRef.current = scramble;
  }, [scramble]);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    setStatus("running");
    timerRef.current = setInterval(() => {
      setDisplayTime(Date.now() - startTimeRef.current);
    }, 10);
  };

  const stopTimer = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const rawTime = Date.now() - startTimeRef.current;

    setStatus("finished");
    setDisplayTime(rawTime);

    await addSolve({
      scramble: currentScrambleRef.current,
      rawTime,
      cube,
      penalty,
      solveSessionId: currentSolveSession,
    });

    setScramble(generateScramble(cube));
  };

  const resetTimer = () => {
    setDisplayTime(0);
    setStatus("ready");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();

      if (status === "running") {
        stopTimer();
      } else if (status === "finished") {
        resetTimer();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (status === "ready") {
        startTimer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [status]);

  const formatTime = (ms: number) => {
    const seconds = Number(((ms % 100000) % 60000) / 1000)
      .toFixed(2)
      .padStart(5, "0");
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000) % 60;
    // 123410

    if (hours) {
      return `${hours}.${minutes}.${seconds}`;
    } else if (minutes) {
      return `${minutes}.${seconds}`;
    } else {
      return `${seconds}`;
    }
  };

  return (
    <SolveContext.Provider value={{ scramble, time: formatTime(displayTime) }}>
      {children}
    </SolveContext.Provider>
  );
};

export const useSolveContext = () => {
  const context = useContext(SolveContext);
  if (!context)
    throw new Error("useSolveContext must be used within SolveProvider");
  return context;
};
