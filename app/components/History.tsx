import React from "react";
import BarChartMultiple from "@/components/ui/bar-chart";
const History = () => {
  return (
    <div className="w-full h-full flex flex-col space-y-4 mt-16">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold">History</h2>
      </div>
      <div className="">
        <BarChartMultiple />
      </div>
    </div>
  );
};

export default History;
