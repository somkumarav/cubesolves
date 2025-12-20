"use client";
import { useSolveContext } from "@/context/solve-context";

export default function Home() {
  const { time, scramble } = useSolveContext();

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
        <h2 className='text-6xl font-robotoMono font-semibold tracking-wider'>
          {time}
        </h2>
      </div>
      <div></div>
    </div>
  );
}
