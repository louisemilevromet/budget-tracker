import React from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCards = ({
  incomeTransactions,
  expenseTransactions,
  loading,
}: {
  incomeTransactions: any;
  expenseTransactions: any;
  loading: boolean;
}) => {
  const { user } = useUser();

  const isNegative =
    (incomeTransactions?.reduce(
      (acc: number, curr: any) => acc + curr.amount,
      0
    ) ?? 0) -
      (expenseTransactions?.reduce(
        (acc: number, curr: any) => acc + curr.amount,
        0
      ) ?? 0) <
    0;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {loading ? (
        <>
          <Skeleton className="p-6 rounded-xl border shadow h-[106px]" />
          <Skeleton className="p-6 rounded-xl border shadow h-[106px]" />
          <Skeleton className="p-6 rounded-xl border shadow h-[106px]" />
        </>
      ) : (
        <>
          <div className="p-6 rounded-xl border shadow">
            <div className="flex flex-row gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
              <div className="flex flex-col">
                <p className="text-gray-500">Income</p>
                <div className="text-2xl font-bold">
                  {`$${incomeTransactions?.reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString()}`}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border shadow">
            <div className="flex flex-row gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-down h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10"
              >
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                <polyline points="16 17 22 17 22 11"></polyline>
              </svg>
              <div className="flex flex-col">
                <p className="text-gray-500">Expense</p>
                <div className="text-2xl font-bold">
                  {`$${expenseTransactions?.reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString()}`}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl border shadow">
            <div className="flex flex-row gap-4 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-wallet h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
              </svg>
              <div className="flex flex-col">
                <p className="text-gray-500">Balance</p>

                <div className="text-2xl font-bold">
                  {`${isNegative ? "-$ " : "$"}${Math.abs(
                    (incomeTransactions?.reduce(
                      (acc: number, curr: any) => acc + curr.amount,
                      0
                    ) ?? 0) -
                      (expenseTransactions?.reduce(
                        (acc: number, curr: any) => acc + curr.amount,
                        0
                      ) ?? 0)
                  ).toLocaleString()}`}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsCards;
