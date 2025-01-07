"use client"
import React from 'react'
import { UserButton, SignInButton, SignOutButton, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

function page() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Home</h1>
        <SignInButton>
          <Button>
            Sign In
          </Button>
        </SignInButton>
    </div>
  )
}

export default page