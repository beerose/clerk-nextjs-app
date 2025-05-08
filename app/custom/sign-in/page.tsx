'use client'

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { OAuthStrategy } from '@clerk/types'
import { useRouter } from 'next/navigation'
import { ClerkAPIError } from '@clerk/types'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { ClerkApiErrors } from '@/src/components/ClerkApiErrors'
import { EmailPasswordForm } from '@/src/components/EmailPasswordForm'
import Link from 'next/link'
import { MFAVerificationForm } from '@/src/components/MFAVerificationForm'

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [displayTOTP, setDisplayTOTP] = React.useState(false)
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()
  const [credentials, setCredentials] = React.useState({
    email: '',
    password: '',
  })

  const router = useRouter()

  async function handleSubmit(code: string, isBackupCode: boolean) {
    setErrors(undefined)

    if (!isLoaded && !signIn) return null

    try {
      await signIn.create({
        identifier: credentials.email,
        password: credentials.password,
      })

      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: isBackupCode ? 'backup_code' : 'totp',
        code: code,
      })

      await setActive({ session: signInAttempt.createdSessionId })
      if (signInAttempt.status === 'complete') {
        router.push('/')
      } else {
        console.error('Invalid sign in attempt', signInAttempt)
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
      } else {
        console.error(JSON.stringify(err, null, 2))
      }
    }
  }

  const signInWith = (strategy: OAuthStrategy) => {
    setErrors(undefined)
    if (!signIn) return null

    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: '/custom/sign-up/sso-callback',
        redirectUrlComplete: '/',
      })
      .then((_res) => { })
      .catch((err: any) => {
        if (isClerkAPIResponseError(err)) setErrors(err.errors)
        console.error(JSON.stringify(err, null, 2))
      })
  }

  if (displayTOTP) {
    return (
      <>
        <MFAVerificationForm
          onVerify={async (code: string, isBackupCode: boolean) => {
            await handleSubmit(code, isBackupCode)
          }}
        />
        {errors && <ClerkApiErrors errors={errors} />}
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center sm:text-left">Sign in</h1>
      <EmailPasswordForm onSubmit={(email, password) => {
        setErrors(undefined)
        setCredentials({ email, password })
        setDisplayTOTP(true)
      }} />
      <Link href={'/custom/reset-password'} className="text-sm text-blue-600 hover:underline">
        Forgot your password?
      </Link>

      <div className="flex items-center justify-between w-full my-4">
        <hr className="w-full border-gray-300" />
        <span className="px-2 text-gray-500">or</span>
        <hr className="w-full border-gray-300" />
      </div>
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <button
          type="button"
          onClick={() => signInWith('oauth_google')}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign in with Google
        </button>
      </div>
      {errors && <ClerkApiErrors errors={errors} />}
    </>
  )
}
