'use client'

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { EmailCodeFactor, OAuthStrategy, SignInFirstFactor } from '@clerk/types'
import { useRouter } from 'next/navigation'
import { ClerkAPIError } from '@clerk/types'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'

const Errors = ({ errors }: { errors: ClerkAPIError[] }) => {
  if (!errors) return null

  return (
    <div className="flex flex-col gap-2">
      {errors.map((error) => (
        <div key={error.code} className="text-red-600">
          {error.longMessage}
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [verifying, setVerifying] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors(undefined)

    if (!isLoaded && !signIn) return null

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      })

      const isEmailCodeFactor = (factor: SignInFirstFactor): factor is EmailCodeFactor => {
        return factor.strategy === 'email_code'
      }
      const emailCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor)

      if (emailCodeFactor) {
        const { emailAddressId } = emailCodeFactor

        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId,
        })

        setVerifying(true)
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
      console.error(JSON.stringify(err, null, 2))
    }
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault()

    if (!isLoaded && !signIn) return null

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })

        router.push('/')
      } else {
        console.error(signInAttempt)
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const signInWith = (strategy: OAuthStrategy) => {
    if (!signIn) return null

    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: '/custom/sign-up/sso-callback',
        redirectUrlComplete: '/',
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err: any) => {
        if (isClerkAPIResponseError(err)) setErrors(err.errors)
        console.error(JSON.stringify(err, null, 2))
      })
  }

  if (verifying) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 text-gray-800">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center sm:text-left">Verify your email</h1>
          <form onSubmit={handleVerification} className="flex flex-col gap-4 w-full">
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
          {errors && <Errors errors={errors} />}
        </main>
      </div>
    )
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 text-gray-800">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center sm:text-left">Sign in</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </form>
        <div className="flex items-center justify-between w-full my-4">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => signInWith('oauth_google')}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign in with Google
          </button>
        </div>
        {errors && <Errors errors={errors} />}
      </main>
    </div>
  )
}