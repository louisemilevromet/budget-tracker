"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarRangeIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  const handlePeriodChange = (value: string) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

    switch (value) {
      case "all":
        setDate(undefined);
        onDateChange?.(undefined);
        onDateChange?.({ from: new Date(0), to: new Date() });
        break;
      case "this-month":
        setDate({
          from: firstDayOfMonth,
          to: lastDayOfMonth,
        });
        onDateChange?.({ from: firstDayOfMonth, to: lastDayOfMonth });
        break;
      case "last-month":
        setDate({
          from: firstDayOfLastMonth,
          to: lastDayOfLastMonth,
        });
        onDateChange?.({ from: firstDayOfLastMonth, to: lastDayOfLastMonth });
        break;
      case "last-year":
        setDate({
          from: firstDayOfLastYear,
          to: lastDayOfLastYear,
        });
        onDateChange?.({ from: firstDayOfLastYear, to: lastDayOfLastYear });
        break;
      case "this-year":
        setDate({
          from: firstDayOfYear,
          to: lastDayOfYear,
        });
        onDateChange?.({ from: firstDayOfYear, to: lastDayOfYear });
        break;
      default:
        break;
    }
  };

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            
          )}
        >
          <CalendarRangeIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>All time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col gap-2" align="start">
        <Select onValueChange={handlePeriodChange} defaultValue="this-month">
          <SelectTrigger className="!border-none">
            <SelectValue placeholder="Select a period" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="this-month">This month</SelectItem>
            <SelectItem value="last-month">Last month</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
            <SelectItem value="this-year">This year</SelectItem>
          </SelectContent>
        </Select>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleDateSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
