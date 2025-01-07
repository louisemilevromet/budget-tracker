import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, { clerkId, name, email, profilePictureUrl }) => {
    // Create a user constant to check if the user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // If user does not exist, create a new user
    if (!user) {
      const newUser = await ctx.db.insert("users", {
        clerkId,
        name,
        email,
        profilePictureUrl: profilePictureUrl ?? "",
      });
      return newUser;
    }

    // If user exists, update the user
    if (user) {
      await ctx.db.patch(user._id, {
        clerkId,
        name,
        email,
        profilePictureUrl: profilePictureUrl ?? "",
      });
      return user._id;
    }
  },
});
