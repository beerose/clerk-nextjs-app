'use client'

import { SignIn, useUser } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  if (!user) return <SignIn />

  window.location.href = '/'
  return null
}
