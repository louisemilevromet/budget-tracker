"use client";
import Transactions from "@/app/components/Transactions";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function page() {
  const { user } = useUser();
  const transactions = useQuery(api.transactions.getAllTransactionsByClerkId, {
    clerkId: user?.id ?? "",
  });

  return (
    <div className="w-full h-screen">
      <Transactions transactions={transactions} />
    </div>
  );
}

export default page;
