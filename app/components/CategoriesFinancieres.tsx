import React, { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
const CategoriesFinancieres = ({
  incomeCategories,
  expenseCategories,
  loading,
}: {
  incomeCategories: any;
  expenseCategories: any;
  loading: boolean;
}) => {
  const sortedIncomeCategories = useMemo(() => {
    return incomeCategories
      ?.filter((category: any) => category.percentage > 0)
      .sort((a: any, b: any) => b.percentage - a.percentage);
  }, [incomeCategories]);

  const sortedExpenseCategories = useMemo(() => {
    return expenseCategories
      ?.filter((category: any) => category.percentage > 0)
      .sort((a: any, b: any) => b.percentage - a.percentage);
  }, [expenseCategories]);
  return (
    <div className="grid gap-4 md:grid-cols-2 flex-grow">
      <div className="flex flex-col h-80">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ScrollArea className=" pr-4 border rounded-lg p-6 h-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-500">
              Income by Category
            </h3>

            <div className="space-y-4">
              {sortedIncomeCategories?.length > 0 ? (
                sortedIncomeCategories?.map((category: any, index: any) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.name + " " + category.icon}</span>
                      <span className="font-medium">
                        {category.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={category.percentage}
                      className="h-2"
                      variant="income"
                    />
                    <div className="text-sm text-muted-foreground">
                      ${category.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No income categories found
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      <div className="flex flex-col h-80">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ScrollArea className="pr-4 border rounded-lg p-6 h-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-500">
              Expense by Category
            </h3>

            <div className="space-y-4">
              {sortedExpenseCategories?.length > 0 ? (
                sortedExpenseCategories?.map((category: any, index: any) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.name + " " + category.icon}</span>
                      <span className="font-medium">
                        {category.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={category.percentage}
                      className="h-2"
                      variant="expense"
                    />
                    <div className="text-sm text-muted-foreground">
                      ${category.amount.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No expense categories found
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default CategoriesFinancieres;
