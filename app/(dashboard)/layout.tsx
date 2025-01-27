import React from 'react'
import Navbar from '@/app/components/Navbar'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="max-w-[1082px] mx-auto px-8">
        {children}
      </div>
    </div>
  )
}

export default Layout