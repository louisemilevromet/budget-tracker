"use client";
import React from "react";
import { useAuth, useUser, useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function Page() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signIn } = useSignIn();

  // Pour la connexion Google
  const handleGoogleSignIn = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  // Pour la connexion email/mot de passe
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn?.create({
      identifier: email,
      password,
    });
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 flex flex-col items-center justify-center h-screen">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email below to sign in to your account
        </p>
      </div>

      <form onSubmit={handleEmailSignIn} className="space-y-4 w-full">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
        Sign in with Google
      </Button>
    </div>
  );
}

export default Page;
