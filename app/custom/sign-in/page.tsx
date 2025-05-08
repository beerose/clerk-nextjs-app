'use client'

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { EmailCodeFactor, OAuthStrategy, SignInFirstFactor } from '@clerk/types'
import { useRouter } from 'next/navigation'
import { ClerkAPIError } from '@clerk/types'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { ClerkApiErrors } from '@/src/components/ClerkApiErrors'
import { CodeVerificationForm } from '@/src/components/CodeVerificationForm'
import { EmailForm } from '@/src/components/EmailForm'

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [verifying, setVerifying] = React.useState(false)
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()

  const router = useRouter()

  async function handleSubmit(email: string) {
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
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
      } else {
        console.error(JSON.stringify(err, null, 2))
      }
    }
  }

  async function handleVerification(code: string) {
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
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
      } else {
        console.error(JSON.stringify(err, null, 2))
      }
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
      .then((_res) => { })
      .catch((err: any) => {
        if (isClerkAPIResponseError(err)) setErrors(err.errors)
        console.error(JSON.stringify(err, null, 2))
      })
  }

  if (verifying) {
    return (
      <>
        <CodeVerificationForm onVerify={handleVerification} />
        {errors && <ClerkApiErrors errors={errors} />}
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center sm:text-left">Sign in</h1>
      <EmailForm onSubmit={handleSubmit} />
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