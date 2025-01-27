import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get categories by clerkId and type
export const getCategories = query({
  args: { clerkId: v.string(), type: v.string() },
  handler: async (ctx, { clerkId, type }) => {
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .filter((q) => q.eq(q.field("type"), type))
      .collect();
    return categories;
  },
});

// Create a category
export const createCategory = mutation({
  args: {
    clerkId: v.string(),
    type: v.string(),
    name: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, { clerkId, type, name, icon }) => {
    const existingCategory = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("name"), name))
      .first();

    if (existingCategory) {
      throw new Error(`A category named "${name}" already exists`);
    }

    const category = await ctx.db.insert("categories", {
      clerkId,
      type,
      name,
      icon,
    });
    return category;
  },
});

export const getCategoryByName = query({
  args: { clerkId: v.string(), name: v.string(), type: v.string() },
  handler: async (ctx, { clerkId, name, type }) => {
    const category = await ctx.db.query("categories").filter((q) => q.eq(q.field("clerkId"), clerkId)).filter((q) => q.eq(q.field("name"), name)).filter((q) => q.eq(q.field("type"), type)).first();
    return category;
  },
});