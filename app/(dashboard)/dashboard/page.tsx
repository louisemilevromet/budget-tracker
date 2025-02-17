"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Overview from "@/app/components/Overview";
import History from "@/app/components/History";
import CreateTransaction from "@/app/components/CreateTransaction";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const { user, isLoaded } = useUser();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  const handleOpenTransaction = (type: "income" | "expense") => {
    setTransactionType(type);
    setIsTransactionModalOpen(true);
  };

  const handleTransactionClose = (shouldReopen = true) => {
    setIsTransactionModalOpen(shouldReopen);
  };

  return (
    <section>
      <div className="flex justify-between items-center flex-wrap gap-4 mt-16 ">
        <h2 className="text-2xl font-bold flex items-center">
          {loading ? (
            <Skeleton className="inline-block w-52 h-6 ml-2 " />
          ) : (
            "Welcome, " + user?.firstName + "! 👋"
          )}
        </h2>
        <div className="flex gap-4">
          <Button
            variant="income"
            onClick={() => handleOpenTransaction("income")}
          >
            New Income 🤑
          </Button>
          <Button
            variant="expense"
            onClick={() => handleOpenTransaction("expense")}
          >
            New Expense 💳
          </Button>
        </div>
      </div>
      <CreateTransaction
        isOpen={isTransactionModalOpen}
        onClose={handleTransactionClose}
        type={transactionType}
        onSubmit={() => {}}
      />
      <Overview />
      <History />
    </section>
  );
};

export default DashboardPage;
