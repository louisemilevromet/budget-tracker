"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import { Card, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const BarChartMultiple = () => {
  const [year, setYear] = useState<string>("2025");

  const { user } = useUser();

  const incomeTransactions = useQuery(api.transactions.getTransactions, {
    clerkId: user?.id || "",
    type: "income",
    fromDate: `${year}-01-01`,
    toDate: `${year}-12-31`,
  });

  const expenseTransactions = useQuery(api.transactions.getTransactions, {
    clerkId: user?.id || "",
    type: "expense",
    fromDate: `${year}-01-01`,
    toDate: `${year}-12-31`,
  });

  const filterTransactionsByMonth = (transactions: any[], month: number) => {
    const monthlyTransactions = transactions?.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month - 1;
    });

    const totalAmount =
      monthlyTransactions?.reduce(
        (sum, transaction) => sum + (transaction.amount || 0),
        0
      ) || 0;

    return totalAmount;
  };

  const incomeTransactionsByMonth = Array.from({ length: 12 }, (_, i) => {
    return {
      month: i + 1,
      total: filterTransactionsByMonth(incomeTransactions || [], i + 1),
    };
  });

  const expenseTransactionsByMonth = Array.from({ length: 12 }, (_, i) => {
    return {
      month: i + 1,
      total: filterTransactionsByMonth(expenseTransactions || [], i + 1),
    };
  });

  const data = incomeTransactionsByMonth.map((item, index) => ({
    month: new Date(2025, item.month - 1).toLocaleString("en-US", {
      month: "long",
    }),
    income: item.total,
    expense: expenseTransactionsByMonth[index].total,
    balance: item.total - expenseTransactionsByMonth[index].total,
  }));

  return (
    <Card className="p-6 flex flex-col gap-8">
      <CardHeader className="flex items-end p-0">
        <div className="w-[100px]">
          <Select defaultValue={year} onValueChange={(value) => setYear(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 0, right: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={60}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="income"
              fill="#10b981"
              radius={4}
              activeBar={{
                fill: "#059669",
                stroke: "#047857",
                strokeWidth: 1,
                radius: 4,
              }}
            />
            <Bar
              dataKey="expense"
              fill="#ef4444"
              radius={4}
              activeBar={{
                fill: "#dc2626",
                stroke: "#b91c1c",
                strokeWidth: 1,
                radius: 4,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};

export default BarChartMultiple;
