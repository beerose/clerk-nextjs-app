'use client'

import { useClerk } from '@clerk/nextjs'

export const SignOutButton = () => {
  const { signOut } = useClerk()

  return (
    <button
      className="text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
      type="button"
      onClick={() => signOut({ redirectUrl: '/' })}>
      Sign Out
    </button>
  )
}