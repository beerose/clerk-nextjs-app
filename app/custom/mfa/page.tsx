'use client'

import * as React from 'react'
import { useUser, useReverification } from '@clerk/nextjs'
import Link from 'next/link'
import { BackupCodeResource, ClerkAPIError } from '@clerk/types'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { BackupCodes } from '@/src/components/BackupCodes'

const TotpEnabled = () => {
  const { user } = useUser()
  const disableTOTP = useReverification(() => user?.disableTOTP())

  return (
    <div className="flex items-center space-x-4">
      <span className="text-green-600 font-medium">TOTP via authentication app enabled</span>
      <button
        onClick={() => disableTOTP()}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Remove
      </button>
    </div>
  )
}

const TotpDisabled = () => {
  return (
    <Link href="/custom/mfa/add">
      <button className="flex items-center space-x-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        <span className="text-gray-100 font-medium">Enable TOTP via authentication app</span>
      </button>
    </Link>
  )
}

export default function ManageMFA() {
  const { isLoaded, user } = useUser()
  const [showNewCodes, setShowNewCodes] = React.useState(false)
  const [errors, setErrors] = React.useState<ClerkAPIError[] | undefined>([])

  if (!isLoaded) return null

  if (!user) {
    return (
      <p className="text-center text-red-500 font-semibold">
        You must be logged in to access this page
      </p>
    )
  }

  return (
    <div className='w-full flex flex-col items-center gap-y-6'>
      <h1 className="text-2xl font-bold text-center mb-6">User MFA Settings</h1>

      {user.totpEnabled ? <TotpEnabled /> : <TotpDisabled />}

      {user.backupCodeEnabled && user.twoFactorEnabled && (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Generate new backup codes?</span>
          <button
            onClick={() => setShowNewCodes(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Generate
          </button>
        </div>
      )}
      {showNewCodes && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <BackupCodes errors={errors} setErrors={setErrors} />
          <button
            onClick={() => setShowNewCodes(false)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}