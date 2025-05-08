'use client'

import { useState } from "react"

export const MFAVerificationForm = ({
  onVerify
}: {
  onVerify: (code: string, isBackupCode: boolean) => Promise<void>
}) => {
  const [code, setCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)

  return (
    <>
      <h1 className="text-2xl font-bold text-center sm:text-left">Verify your account</h1>
      <form onSubmit={async (e) => {
        e.preventDefault()
        await onVerify(code, useBackupCode)
        setCode('')
        setUseBackupCode(false)
      }} className="flex flex-col gap-4 w-full">
        <label htmlFor="code" className="text-sm font-medium text-gray-700">
          Enter your verification code
        </label>
        <input
          value={code}
          id="code"
          name="code"
          type="text"
          onChange={(e) => setCode(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter code"
        />
        <div className="flex items-center gap-2">
          <input
            onChange={() => setUseBackupCode((prev) => !prev)}
            id="backupcode"
            name="backupcode"
            type="checkbox"
            checked={useBackupCode}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="backupcode" className="text-sm font-medium text-gray-700">
            This code is a backup code
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Verify
        </button>
      </form>
    </>
  )
}
