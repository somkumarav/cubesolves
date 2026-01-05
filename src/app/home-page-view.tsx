"use client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { addSolve, plusTwo } from "@/actions/solve";
import { useTimerStore } from "@/store/timer-store";
import { SolveSession } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FaRedoAlt, FaTimes } from "react-icons/fa";
import { LastFiveSolveShowCase } from "../components/last-five-solve-showcase";
import { formatTime } from "@/lib/format-time";

export default function HomePageView(solveSession: SolveSession) {
  const {
    scramble,
    displayTime,
    lastFiveSolves,
    init,
    refreshScramble,
    start,
    stop,
    reset,
    addToLastFiveSolve,
    updataLastFiveSolve,
  } = useTimerStore();

  useEffect(() => {
    init(solveSession);
  }, [solveSession]);

  const { mutate: addSolveMutation } = useMutation({
    mutationFn: addSolve,

    onSuccess: (data) => {
      if (!data.status || !data.additional) {
        console.log("error");
        /** TODO */
        return;
      }
      addToLastFiveSolve(data.additional);
      refreshScramble(solveSession.cube);
    },
  });

  const { mutate: plusTwoMutation } = useMutation({
    mutationFn: plusTwo,
    onSuccess: (data) => {
      if (!data.status || !data.additional) return;
      updataLastFiveSolve(data.additional);
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();

      const currentStatus = useTimerStore.getState().status;
      if (currentStatus === "running") {
        const result = stop();
        addSolveMutation({
          rawTime: result.time,
          scramble: result.scramble,
          solveSessionId: solveSession.id,
          cube: solveSession.cube,
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
  }, [stop, reset, start, addSolveMutation, solveSession]);

  return (
    <div className='flex flex-col items-center justify-between min-h-[90vh] pb-10'>
      <div className='flex h-[20vh] justify-center pt-5'>
        <h2
          className='text-2xl tracking-wider text-center animate-fade'
          suppressHydrationWarning
        >
          {scramble}
        </h2>
      </div>
      <div className='flex flex-col items-center justify-center '>
        <h2 className={`text-6xl font-robotoMono font-semibold tracking-wider`}>
          {formatTime(displayTime)}
        </h2>
        <div className='pt-8 space-x-4'>
          <Button
            disabled={!lastFiveSolves.length}
            onClick={() => {
              if (!lastFiveSolves.length) return;
              if (lastFiveSolves[lastFiveSolves.length - 1].penalty !== "NONE")
                return;

              plusTwoMutation({
                id: lastFiveSolves[lastFiveSolves.length - 1].id,
              });
            }}
            size='icon'
            variant='ghost'
          >
            <h2 className='font-semibold'>+2</h2>
          </Button>
          <Button size='icon'>
            <FaRedoAlt />
          </Button>
          <Button size='icon' variant='ghost'>
            <FaTimes />
          </Button>
        </div>
      </div>
      <div>
        <LastFiveSolveShowCase lastFiveSolves={lastFiveSolves} />
      </div>
    </div>
  );
}
