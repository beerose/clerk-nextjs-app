'use client'

import { useState } from "react"

export const CodeVerificationForm = ({
  onVerify
}: {
  onVerify: (code: string) => Promise<null | undefined>
}) => {
  const [code, setCode] = useState('')

  return (
    <>
      <h1 className="text-2xl font-bold text-center sm:text-left">Verify your email</h1>
      <form onSubmit={async (e) => {
        e.preventDefault()
        await onVerify(code)
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
