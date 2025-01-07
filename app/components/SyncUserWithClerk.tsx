"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export const SyncUserWithClerk = () => {
  const { user } = useUser();
  const updateUser = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!user) return;

    const syncUser = async () => {
      try {
        await updateUser({
          clerkId: user.id,
          name: user.fullName ?? "",
          email: user.emailAddresses[0].emailAddress ?? "",
          profilePictureUrl: user.imageUrl ?? "",
        });
      } catch (error) {
        throw new Error("Failed to sync user with Clerk");
      }
    };

    syncUser();
  }, [user, updateUser]);

  return null;
};
