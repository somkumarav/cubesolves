"use client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { addSolve } from "@/actions/solve";
import { useTimerStore } from "../store/timer-store";
import { CubeType } from "@prisma/client";

export default function HomePageView({
  cubeType,
  solveSessionId,
}: {
  cubeType: CubeType;
  solveSessionId: string;
}) {
  const { scramble, displayTime, initScramble, start, stop, reset } =
    useTimerStore();

  useEffect(() => {
    initScramble(cubeType);
  }, [cubeType, initScramble]);

  const { mutate } = useMutation({
    mutationFn: addSolve,
    onSuccess: () => {
      initScramble(cubeType);
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();

      const currentStatus = useTimerStore.getState().status;
      if (currentStatus === "running") {
        const result = stop();
        mutate({
          rawTime: result.time,
          scramble: result.scramble,
          solveSessionId: solveSessionId,
          cube: cubeType,
          penalty: "NONE",
        });
      } else if (currentStatus === "finished") {
        reset();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (useTimerStore.getState().status === "ready") {
        start();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [stop, reset, start, mutate, solveSessionId, cubeType]);

  return (
    <div className='flex flex-col items-center justify-between min-h-[90vh]'>
      <div className='flex h-[20vh] justify-center pt-5'>
        <h2
          className='text-2xl tracking-wider text-center animate-fade'
          suppressHydrationWarning
        >
          {scramble}
        </h2>
      </div>
      <div className='flex items-center justify-center '>
        <h2 className={`text-6xl font-robotoMono font-semibold tracking-wider`}>
          {(displayTime / 1000).toFixed(2)}
        </h2>
      </div>
      <div></div>
    </div>
  );
}
