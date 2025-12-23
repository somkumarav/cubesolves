import { Solve } from "@prisma/client";

export const LastFiveSolveShowCase = ({
  lastFiveSolves,
}: {
  lastFiveSolves: Solve[];
}) => {
  if (!lastFiveSolves.length) return null;

  return (
    <div className=' flex py-1 px-4 space-x-16 items-center justify-around rounded-full bg-component'>
      {lastFiveSolves?.map((solve) => {
        return (
          <p className='font-medium' key={solve.id}>
            {(solve.time / 1000).toFixed(2)}
          </p>
        );
      })}
    </div>
  );
};
