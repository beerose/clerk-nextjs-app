import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { sessionClaims, userId } = await auth()

  const birthdate = sessionClaims?.birthdate as string

  return NextResponse.json({ userId, birthdate })
}