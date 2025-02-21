import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTransactions = query({
  args: {
    clerkId: v.string(),
    type: v.string(),
    fromDate: v.string(),
    toDate: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, { clerkId, type, fromDate, toDate, category }) => {
    let transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .filter((q) => q.eq(q.field("type"), type))
      .filter((q) =>
        q.and(q.gte(q.field("date"), fromDate), q.lte(q.field("date"), toDate))
      );
    if (category) {
      transactions = transactions.filter((q) =>
        q.eq(q.field("categoryId"), category)
      );
    }
    return transactions.collect();
  },
});

export const createTransaction = mutation({
  args: {
    amount: v.number(),
    description: v.optional(v.string()),
    clerkId: v.string(),
    categoryId: v.id("categories"),
    type: v.string(),
    date: v.string(),
  },

  handler: async (ctx, args) => {
    const transaction = await ctx.db.insert("transactions", {
      amount: args.amount,
      description: args.description,
      clerkId: args.clerkId,
      categoryId: args.categoryId,
      type: args.type,
      date: args.date,
    });
    return transaction;
  },
});

export const getAllTransactionsByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .collect();
  },
});

export const deleteTransaction = mutation({
  args: {
    id: v.id("transactions"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const updateTransaction = mutation({
  args: {
    id: v.id("transactions"),
    data: v.object({
      amount: v.number(),
      description: v.optional(v.string()),
      categoryId: v.id("categories"),
      type: v.string(),
      date: v.string(),
    }),
  },
  handler: async (ctx, { id, data }) => {
    await ctx.db.patch(id, data);
  },
});
