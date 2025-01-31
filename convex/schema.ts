import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User table
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    profilePictureUrl: v.string(),
    currency: v.string(),
  }).index("by_email", ["email"])
  .index("by_clerk_id", ["clerkId"]),

  // Categories table
  categories: defineTable({
    name: v.string(),
    icon: v.string(),
    type: v.string(),
    clerkId: v.string(),
  }).index("by_clerk_id_and_type", ["clerkId", "type"])
  .index("by_name", ["name"]),

  // Transactions table
  transactions: defineTable({
    amount: v.number(),
    description: v.optional(v.string()),
    clerkId: v.string(),
    categoryId: v.id("categories"),
    type: v.string(),
    date: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_type", ["type"])
    .index("by_date", ["date"]),

  // Month history table
  monthHistory: defineTable({
    day: v.number(),
    month: v.number(),
    year: v.number(),
    userId: v.id("users"),
    income: v.number(),
    expenses: v.number(),
  }).index("by_user_id", ["userId"]),

  // Year history table
  yearHistory: defineTable({
    year: v.number(),
    userId: v.id("users"),
    income: v.number(),
    expenses: v.number(),
  }).index("by_user_id", ["userId"]),

});
