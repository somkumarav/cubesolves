"use client";

import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getSolves } from "@/actions/solve-session";
import { GetSolves } from "@/schemas/solve-session";

type SolvesPageParam = { solveSessionId: string | null; cursor: number | null };

export function useInfiniteSolves(params: SolvesPageParam) {
  return useInfiniteQuery(dataOptions(params));
}

export const dataOptions = (searchParams: GetSolves) => {
  return infiniteQueryOptions({
    queryKey: ["solves"],
    initialPageParam: {
      cursor: null,
      solveSessionId: null,
    } as SolvesPageParam,
    queryFn: async ({ pageParam }: { pageParam: SolvesPageParam }) => {
      const param = pageParam ?? {
        solveSessionId: searchParams.solveSessionId ?? null,
        cursor: null,
      };
      const res = await getSolves(param);
      if(
        !res.status
        || !res.additional?.items
      ){
        throw new Error(res.message || "Failed to fetch solves data");
      }
      return res.additional
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextCursor) return null;
      return {
        cursor: lastPage.nextCursor,
        solveSessionId: searchParams.solveSessionId ?? null,
      };
    },

    refetchOnWindowFocus: false,
  });
};


// export function useInfiniteSolves(params: SolvesPageParam) {
//   return useInfiniteQuery(dataOptions(params));
// }

// export const dataOptions = (searchParams: FetchSolvesProps) => {
//   return infiniteQueryOptions({
//     queryKey: ["solves"],
//     initialPageParam: {
//       cursor: null,
//       solveSessionId: null,
//     } as SolvesPageParam,
//     queryFn: async ({ pageParam }: { pageParam: SolvesPageParam }) => {
//       const param = pageParam ?? {
//         solveSessionId: searchParams.solveSessionId ?? null,
//         cursor: null,
//       };
//       await fetchSolve(param);
//     },
//     getNextPageParam: (lastPage) => {
//       if (!lastPage.nextCursor) return null;
//       return {
//         cursor: lastPage.nextCursor,
//         solveSessionId: searchParams.solveSessionId ?? null,
//       };
//     },

//     // getPreviousPageParam: (firstPage, _pages) => {
//     //   if (!firstPage.prevCursor) return null;
//     //   return { cursor: firstPage.prevCursor, direction: "prev" };
//     // },
//     refetchOnWindowFocus: false,
//   });
// };

