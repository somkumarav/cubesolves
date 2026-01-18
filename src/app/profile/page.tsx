"use client";
import { SolveTable } from "@/components/profile/solve-table/data-table";
import { columns } from "@/components/profile/solve-table/columns";
import { useInfiniteSolves } from "@/components/profile/solve-table/useInfiniteSolves";
import { useMemo } from "react";

export default function ProfilePage() {
  const { data, isFetching, isLoading, fetchNextPage, hasNextPage, isError, error} =
    useInfiniteSolves({
      cursor: null,
      solveSessionId: null,
    });

    if(isError && error){
      console.error(error)
    }

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.items ?? []) ?? [],
    [data?.pages]
  );

  return (
    <div className='h-[90vh] overflow-y-scroll'>
      <SolveTable
        columns={columns}
        data={flatData}
        isLoading={isLoading}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}
