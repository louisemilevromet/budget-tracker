import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    profilePictureUrl: v.optional(v.string()),
    currency: v.string(),
  },
  handler: async (
    ctx,
    { clerkId, name, email, profilePictureUrl, currency }
  ) => {
    // Create a user constant to check if the user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    // If user does not exist, create a new user
    if (!user) {
      const newUser = await ctx.db.insert("users", {
        clerkId,
        name,
        email,
        profilePictureUrl: profilePictureUrl ?? "",
        currency,
      });
      return newUser;
    }

    const updatedUser = await ctx.db.patch(user._id, {
      name,
      email,
      profilePictureUrl: profilePictureUrl ?? user.profilePictureUrl,
      currency: currency || user.currency,
    });
    return updatedUser;
  },
});

export const getUserCurrency = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});
