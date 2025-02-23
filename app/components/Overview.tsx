"use client";

import { useState, useEffect } from "react";
import { DatePickerWithRange } from "@/app/components/DatePickerWithRange";
import StatsCards from "@/app/components/StatsCards";
import CategoriesFinancieres from "@/app/components/CategoriesFinancieres";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

const Overview = () => {
  const { user } = useUser();
  const [fromDate, setFromDate] = useState<string | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  );
  const [toDate, setToDate] = useState<string | undefined>(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toISOString()
  );
  const [loading, setLoading] = useState(true);

  const incomeTransactions = useQuery(api.transactions.getTransactions, {
    clerkId: user?.id || "",
    type: "income",
    fromDate: fromDate || "",
    toDate: toDate || "",
  });
  const expenseTransactions = useQuery(api.transactions.getTransactions, {
    clerkId: user?.id || "",
    type: "expense",
    fromDate: fromDate || "",
    toDate: toDate || "",
  });

  const incomeCategories = useQuery(api.categories.getCategories, {
    clerkId: user?.id || "",
    type: "income",
  });
  const expenseCategories = useQuery(api.categories.getCategories, {
    clerkId: user?.id || "",
    type: "expense",
  });

  console.log(incomeTransactions, "incomeTransactions");
  console.log(incomeCategories, "incomeCategories");

  useEffect(() => {
    if (
      incomeTransactions &&
      expenseTransactions &&
      incomeCategories &&
      expenseCategories
    ) {
      setLoading(false);
    }
  }, [
    incomeTransactions,
    expenseTransactions,
    incomeCategories,
    expenseCategories,
  ]);

  const handleDateChange = (date: { from: Date; to: Date } | undefined) => {
    setLoading(true);
    setFromDate(date?.from.toISOString() || undefined);
    setToDate(date?.to.toISOString() || undefined);
  };

  const getTransactionsByCategory = (
    transactions: any[] = [],
    categories: any[] = []
  ) => {
    return categories.map((category) => {
      const categoryTransactions =
        transactions?.filter(
          (transaction) => transaction.categoryId === category._id
        ) || [];

      const totalAmount = categoryTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      const percentage = transactions?.length
        ? (totalAmount / transactions.reduce((sum, t) => sum + t.amount, 0)) *
          100
        : 0;

      return {
        ...category,
        transactions: categoryTransactions,
        amount: totalAmount,
        percentage: Math.round(percentage * 100) / 100,
      };
    });
  };

  const incomeCategoriesWithStats = getTransactionsByCategory(
    incomeTransactions,
    incomeCategories
  );
  const expenseCategoriesWithStats = getTransactionsByCategory(
    expenseTransactions,
    expenseCategories
  );

  return (
    <div className="w-full h-full flex flex-col space-y-4 mt-16">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold">Overview</h2>
        <DatePickerWithRange
          onDateChange={(date) => {
            if (date) {
              handleDateChange({
                from: date.from || new Date(),
                to: date.to || new Date(),
              });
            } else {
              handleDateChange(undefined);
            }
          }}
        />
      </div>
      <StatsCards
        incomeTransactions={incomeTransactions}
        expenseTransactions={expenseTransactions}
        loading={loading}
      />
      <CategoriesFinancieres
        incomeCategories={incomeCategoriesWithStats}
        expenseCategories={expenseCategoriesWithStats}
        loading={loading}
      />
    </div>
  );
};

export default Overview;
