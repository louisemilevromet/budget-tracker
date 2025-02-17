"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isSignedIn) {
      router.push("/wizard");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <p>Start budgeting now!</p>
      <Button className="mt-4" onClick={handleClick}>
        Go
      </Button>
    </div>
  );
}

export default Page;
