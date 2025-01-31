import React from "react";
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
              {incomeCategories?.length > 0 ? (
                incomeCategories?.map((category: any, index: any) => (
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
              {expenseCategories?.length > 0 ? (
                expenseCategories?.map((category: any, index: any) => (
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
