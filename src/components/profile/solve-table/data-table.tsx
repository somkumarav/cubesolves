"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef } from "react";
import { FetchNextPageOptions } from "@tanstack/react-query";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isFetching?: boolean;
  isLoading?: boolean;
  hasNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<unknown>;
}

export function SolveTable<TData, TValue>({
  columns,
  data,
  isFetching,
  isLoading,
  hasNextPage,
  fetchNextPage,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, isFetching]);

  return (
    <div className='overflow-y-auto rounded-t-md'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='text-center text-component-font-sub'
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            <>
              {table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  ref={observerTarget}
                  className='text-center text-component-font-sub'
                >
                  {isFetching
                    ? "Loading more..."
                    : hasNextPage
                    ? "Scroll for more"
                    : "You've reached the end of the list"}
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
