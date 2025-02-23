"use client";

import { useState, useEffect } from "react";
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

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("this-month");

  useEffect(() => {
    const loadInitialDate = (): DateRange | undefined => {
      const savedDate = localStorage.getItem("selectedDateRange");
      if (savedDate) {
        const parsed = JSON.parse(savedDate);
        return {
          from: new Date(parsed.from),
          to: new Date(parsed.to),
        };
      }
      return getDefaultDateRange();
    };

    const getDefaultDateRange = (): DateRange => ({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    });

    const savedPeriod = localStorage.getItem("selectedPeriod");
    if (savedPeriod) {
      setSelectedPeriod(savedPeriod);
      handlePeriodChange(savedPeriod);
    } else {
      setDate(loadInitialDate());
    }
  }, []);

  const handlePeriodChange = (value: string) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );
    const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

    let newDate: DateRange | undefined;

    switch (value) {
      case "all":
        newDate = { from: new Date(0), to: new Date() };
        break;
      case "this-month":
        newDate = {
          from: firstDayOfMonth,
          to: lastDayOfMonth,
        };
        break;
      case "last-month":
        newDate = {
          from: firstDayOfLastMonth,
          to: lastDayOfLastMonth,
        };
        break;
      case "last-year":
        newDate = {
          from: firstDayOfLastYear,
          to: lastDayOfLastYear,
        };
        break;
      case "this-year":
        newDate = {
          from: firstDayOfYear,
          to: lastDayOfYear,
        };
        break;
      default:
        return;
    }

    setDate(newDate);
    setSelectedPeriod(value);
    onDateChange?.(newDate);

    // Save to localStorage
    localStorage.setItem("selectedDateRange", JSON.stringify(newDate));
    localStorage.setItem("selectedPeriod", value);
  };

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onDateChange?.(newDate);

    // Save to localStorage if date is selected
    if (newDate) {
      localStorage.setItem("selectedDateRange", JSON.stringify(newDate));
      // Reset period selection when custom date is selected
      setSelectedPeriod("custom");
      localStorage.setItem("selectedPeriod", "custom");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn("justify-start text-left font-normal", className)}
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
      <PopoverContent className="w-auto p-0 flex flex-col gap-2" align="end">
        <Select onValueChange={handlePeriodChange} value={selectedPeriod}>
          <SelectTrigger className="!border-none">
            <SelectValue placeholder="Select a period" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="this-month">This month</SelectItem>
            <SelectItem value="last-month">Last month</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
            <SelectItem value="this-year">This year</SelectItem>
            {selectedPeriod === "custom" && (
              <SelectItem value="custom">Custom Range</SelectItem>
            )}
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
