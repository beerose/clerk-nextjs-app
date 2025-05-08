'use client'

import { useState } from "react"

export const EmailPasswordForm = ({
  onSubmit,
}: {
  onSubmit: (email: string, password: string) => Promise<null | undefined>
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await onSubmit(email, password)
    }} className="flex flex-col gap-4 w-full">
      <label htmlFor="email" className="text-sm font-medium text-gray-700">
        Enter email
      </label>
      <input
        value={email}
        id="email"
        name="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="you@example.com"
      />
      <label htmlFor="password" className="text-sm font-medium text-gray-700">
        Enter password
      </label>
      <input
        value={password}
        id="password"
        name="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="mysecretpassword"
      />
      <button
        type="submit"
        className="px-4 py-2 mt-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Continue
      </button>
    </form>
  )
}
