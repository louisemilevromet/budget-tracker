"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import ModifyTransactionDialog from "./ModifyTransactionDialog";

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  description: string;
  type: "income" | "expense";
  categoryId: string;
  clerkId: string;
  _creationTime: string;
}

const Transactions = ({ transactions }: { transactions: any }) => {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const categoryIds = transactions?.map((t: any) => t.categoryId) || [];
  const categories = useQuery(api.categories.getCategoriesByIds, {
    ids: Array.from(new Set(categoryIds)) as string[],
  });

  const categoryMap = useMemo(() => {
    return new Map(categories?.map((c) => [c._id, c]));
  }, [categories]);

  const deleteTransaction = useMutation(api.transactions.deleteTransaction);
  const updateTransaction = useMutation(api.transactions.updateTransaction);

  const sortedAndFilteredTransactions = useMemo(() => {
    return (transactions || [])
      .filter((transaction: any) => {
        if (filterType === "all") return true;
        return transaction.type === filterType;
      })
      .filter((transaction: any) => {
        const categoryName =
          categoryMap?.get(transaction.categoryId)?.name || "";
        const signedAmount =
          transaction.type === "expense"
            ? -Math.abs(transaction.amount)
            : Math.abs(transaction.amount);
        const formattedAmount = signedAmount.toFixed(2);

        return (
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formattedAmount.includes(searchTerm)
        );
      })
      .sort((a: any, b: any) => {
        let aValue =
          sortField === "category"
            ? categoryMap?.get(a.categoryId)?.name || ""
            : a[sortField];
        let bValue =
          sortField === "category"
            ? categoryMap?.get(b.categoryId)?.name || ""
            : b[sortField];

        if (sortField === "amount") {
          aValue = a.type === "expense" ? -Math.abs(a.amount) : a.amount;
          bValue = b.type === "expense" ? -Math.abs(b.amount) : b.amount;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    transactions,
    categoryMap,
    sortField,
    sortDirection,
    filterType,
    searchTerm,
  ]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = (id: string) => {
    deleteTransaction({ id: id as Id<"transactions"> });
  };

  const handleUpdate = (id: string, newData: Partial<Transaction>) => {
    updateTransaction({
      id: id as Id<"transactions">,
      data: newData as any,
    });
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 my-16">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold">Transactions</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={filterType}
            onValueChange={(value) =>
              setFilterType(value as "all" | "income" | "expense")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-0">
              <Button
                variant="ghost"
                onClick={() => handleSort("date")}
                className="hover:bg-transparent"
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="p-0">
              <Button
                variant="ghost"
                onClick={() => handleSort("description")}
                className="hover:bg-transparent"
              >
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="p-0">
              <Button
                variant="ghost"
                onClick={() => handleSort("category")}
                className="hover:bg-transparent"
              >
                Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="p-0">
              <Button
                variant="ghost"
                onClick={() => handleSort("amount")}
                className="hover:bg-transparent"
              >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredTransactions?.length ? (
            sortedAndFilteredTransactions.map((transaction: any) => (
              <TableRow key={transaction._id}>
                <TableCell className="font-medium">
                  {new Date(transaction.date).toISOString().split("T")[0]}
                </TableCell>
                <TableCell>
                  {transaction.description
                    ? transaction.description
                    : "No Description"}
                </TableCell>
                <TableCell>
                  {categoryMap?.get(transaction.categoryId)?.name}
                </TableCell>
                <TableCell
                  className={`${transaction.type === "income" ? "text-[#59F3A6]" : "text-red-500"}`}
                >
                  {transaction.type === "expense" ? "-" : ""}
                  {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <DeleteTransactionDialog
                      onConfirm={() => handleDelete(transaction._id)}
                    />
                    <ModifyTransactionDialog
                      transaction={transaction}
                      onConfirm={(newData) =>
                        handleUpdate(transaction._id, newData)
                      }
                      categories={
                        categories?.map(({ _id, name }) => ({ _id, name })) ??
                        []
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Transactions;
