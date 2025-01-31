"use client";

import * as React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateCategory from "./CreateCategory";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface TransactionProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  onSubmit: (data: TransactionData) => void;
  type: "income" | "expense";
}

interface TransactionData {
  type: "income" | "expense";
  amount: number;
  category: string;
  categoryId: string;
  date: Date;
  description: string;
}

const CreateTransaction: React.FC<TransactionProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
}) => {
  const [transactionData, setTransactionData] = useState<TransactionData>({
    type: type,
    amount: 0,
    category: "",
    categoryId: "",
    date: new Date(),
    description: "",
  });

  const { user } = useUser();
  const { toast } = useToast();
  const [value, setValue] = React.useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);

  const createTransaction = useMutation(api.transactions.createTransaction);

  const categories = useQuery(api.categories.getCategories, {
    clerkId: user?.id ?? "",
    type: type,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]:
        name === "amount"
          ? value === ""
            ? ""
            : parseFloat(parseFloat(value).toFixed(2))
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(transactionData);
    onClose(false);
    await createTransaction({
      clerkId: user?.id ?? "",
      type: type,
      amount: transactionData.amount,
      categoryId: transactionData.categoryId as any,
      description: transactionData.description,
      date: transactionData.date.toISOString(),
    });
    toast({
      variant: "success",
      description: "🎉 Transaction added successfully",
    });
  };

  const handleOpenCategoryModal = () => {
    onClose(false);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = (
    newCategoryName: string,
    newCategoryId: string
  ) => {
    setValue(newCategoryName);
    setTransactionData((prev) => ({
      ...prev,
      category: newCategoryName,
      categoryId: newCategoryId,
    }));
    setIsCategoryModalOpen(false);
    onClose(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create a new{" "}
              <span
                className={
                  type === "income" ? "text-green-500" : "text-red-500"
                }
              >
                {type}
              </span>{" "}
              transaction
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min={0.01}
                  step="any"
                  placeholder="0.00"
                  value={transactionData.amount}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={transactionData.description}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Optional"
                  maxLength={50}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Popover
                    open={isCategorySelectOpen}
                    onOpenChange={setIsCategorySelectOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isCategorySelectOpen}
                        className="w-[200px] justify-between"
                      >
                        {value
                          ? categories?.find(
                              (category) => category.name === value
                            )?.name +
                            " " +
                            categories?.find(
                              (category) => category.name === value
                            )?.icon
                          : "Select category..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <Button
                          variant="outline"
                          className="w-full justify-start !gap-0 !px-3 text-left font-normal"
                          onClick={handleOpenCategoryModal}
                          type="button"
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Category
                        </Button>
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories?.map((category) => (
                              <CommandItem
                                className="cursor-pointer"
                                key={category.name}
                                value={category.name}
                                onSelect={(currentValue) => {
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setTransactionData((prev) => ({
                                    ...prev,
                                    category: currentValue,
                                    categoryId: category._id,
                                  }));
                                  setIsCategorySelectOpen(false);
                                }}
                              >
                                {category.name + " " + category.icon}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    value === category.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !transactionData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {transactionData.date ? (
                          format(transactionData.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={transactionData.date}
                        onSelect={(date) =>
                          setTransactionData((prev) => ({
                            ...prev,
                            date: date ?? new Date(),
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={type === "income" ? "income" : "expense"}
                disabled={
                  transactionData.amount <= 0 || !transactionData.category
                }
                onClick={() => {}}
              >
                Add {type}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CreateCategory
        isOpen={isCategoryModalOpen}
        onClose={(newCategoryName?: string, newCategoryId?: string) =>
          handleCloseCategoryModal(newCategoryName ?? "", newCategoryId ?? "")
        }
        type={type}
        onCancel={() => {
          setIsCategoryModalOpen(false);
          onClose(true);
        }}
      />
    </>
  );
};

export default CreateTransaction;
