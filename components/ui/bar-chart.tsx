"use client"

import { useState, useMemo , useEffect} from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

const chartData = [
  { month: "January", desktop: 222, mobile: 150 },
  { month: "February", desktop: 97, mobile: 180 },
  { month: "March", desktop: 167, mobile: 120 },
  { month: "April", desktop: 242, mobile: 260 },
  { month: "May", desktop: 373, mobile: 290 },
  { month: "June", desktop: 301, mobile: 340 },
  { month: "July", desktop: 222, mobile: 150 },
  { month: "August", desktop: 97, mobile: 180 },
  { month: "September", desktop: 167, mobile: 120 },
  { month: "October", desktop: 242, mobile: 260 },
  { month: "November", desktop: 373, mobile: 290 },
  { month: "December", desktop: 301, mobile: 340 },

]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const BarChartMultiple = () => {
  const [activeChart, setActiveChart] =
   useState<keyof typeof chartConfig>("desktop")

  const total = useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )

  const [year, setYear] = useState<string>("2025");

  const { user } = useUser();

  const incomeTransactions = useQuery(api.transactions.getTransactions, { 
    clerkId: user?.id || "", 
    type: "income", 
    fromDate: `${year}-01-01`, 
    toDate: `${year}-12-31` 
  });


  const filterTransactionsByMonth = (transactions: Transaction[], month: number) => {
    const monthlyTransactions = transactions?.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month - 1;
    });
    
    const totalAmount = monthlyTransactions?.reduce((sum, transaction) => 
      sum + (transaction.amount || 0), 0
    ) || 0;

    return totalAmount;
  };

  const incomeTransactionsByMonth = Array.from({ length: 12 }, (_, i) => {
    return {
      month: i + 1,
      total: filterTransactionsByMonth(incomeTransactions || [], i + 1)
    };
  });

  useEffect(() => {
    console.log(incomeTransactionsByMonth);
    console.log(year);
  }, [year, incomeTransactionsByMonth]);

  const data = incomeTransactionsByMonth.map((item) => ({
    month: new Date(2025, item.month - 1).toLocaleString('default', { month: 'long' }),
    income: item.total,
  }));

  return (
    <Card>
      <CardHeader>
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
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="#10b981" radius={4} />
            <Bar dataKey="expense" fill="#ef4444" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarChartMultiple;