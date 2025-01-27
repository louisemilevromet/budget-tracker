"use client"
import React from 'react'
import { UserButton, SignInButton, SignOutButton, useAuth, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

function page() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div>
      <h1>Home</h1>
      {isSignedIn ? 
      <div>
      <SignOutButton />
      <UserButton />
      </div> : <SignInButton />}
    </div>
  )
}

export default page