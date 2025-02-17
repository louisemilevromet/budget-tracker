import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

function page() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <p>Start budgeting now!</p>
      <Button className="mt-4">
        <Link href="/wizard">Go</Link>
      </Button>
    </div>
  );
}

export default page;
