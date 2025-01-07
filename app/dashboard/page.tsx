import React from 'react'
import { SignOutButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

function page() {
  return (
    <div>
      <h1>Dashboard</h1>
        <SignOutButton>
        <Button>
          Sign Out
        </Button>
      </SignOutButton>

      <UserButton />
    </div>
  )
}

export default page