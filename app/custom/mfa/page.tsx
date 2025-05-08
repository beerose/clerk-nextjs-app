'use client'

import * as React from 'react'
import { useUser, useReverification } from '@clerk/nextjs'
import Link from 'next/link'
import { BackupCodeResource, ClerkAPIError } from '@clerk/types'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'

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

export function GenerateBackupCodes({
  setErrors,
}: {
  errors: ClerkAPIError[] | undefined
  setErrors: React.Dispatch<React.SetStateAction<ClerkAPIError[] | undefined>>
}) {
  const { user } = useUser()
  const [backupCodes, setBackupCodes] = React.useState<BackupCodeResource | undefined>(undefined)
  const createBackupCode = useReverification(() => user?.createBackupCode())

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setErrors(undefined)
    if (backupCodes) {
      return
    }

    setLoading(true)
    void createBackupCode()
      .then((backupCode: BackupCodeResource | undefined) => {
        setBackupCodes(backupCode)
        setLoading(false)
      })
      .catch((err) => {
        if (isClerkAPIResponseError(err)) setErrors(err.errors)
        setLoading(false)
      })
  }, [])
  if (loading) {
    return <p className="text-blue-500 font-medium">Loading...</p>
  }

  if (!backupCodes) {
    return <p className="text-red-500 font-medium">There was a problem generating backup codes</p>
  }

  return (
    <ol className="list-decimal list-inside bg-gray-100 p-4 rounded shadow">
      {backupCodes.codes.map((code, index) => (
        <li key={index} className="text-gray-800 font-mono">
          {code}
        </li>
      ))}
    </ol>
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
          <GenerateBackupCodes errors={errors} setErrors={setErrors} />
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