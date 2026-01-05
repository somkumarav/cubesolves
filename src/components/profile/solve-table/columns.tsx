"use client";
import { Solve } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatTime } from "../../../lib/format-time";

export const columns: ColumnDef<Solve>[] = [
  {
    accessorKey: "scramble",
    header: "scramble",
  },
  {
    accessorKey: "time",
    header: () => <div className='text-right'>time</div>,
    cell: (info) => {
      const time = info.getValue() as number;
      // const formattedTime = (time / 1000).toFixed(2);
      const formattedTime = formatTime(time);
      return <div className='text-right'>{formattedTime}</div>;
    },
  },
  // {
  //   accessorKey: "rawTime",
  //   header: "Raw Time",
  // },
  {
    accessorKey: "penalty",
    header: () => <div className='text-right'>penalty</div>,
    cell: (info) => {
      const penalty = info.getValue();
      return (
        <div className='text-right'>{penalty == "NONE" ? "none" : "+2"}</div>
      );
    },
  },
];
