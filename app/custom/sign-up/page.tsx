'use client'

import * as React from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ClerkAPIError } from '@clerk/types'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { CodeVerificationForm } from '@/src/components/CodeVerificationForm'
import { EmailPasswordForm } from '@/src/components/EmailPasswordForm'

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
  const { isLoaded, signUp, setActive } = useSignUp()
  const [verifying, setVerifying] = React.useState(false)
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()
  const router = useRouter()

  async function handleSubmit(email: string, password: string) {
    setErrors(undefined)

    if (!isLoaded && !signUp) return null

    try {
      await signUp.create({
        emailAddress: email,
        password
      })

      await signUp.prepareEmailAddressVerification()

      setVerifying(true)
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
      console.error(JSON.stringify(err, null, 2))
    }
  }

  async function handleVerification(code: string) {
    setErrors(undefined)

    if (!isLoaded && !signUp) return null

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })

        router.push('/')
      } else {
        console.error(signUpAttempt)
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors)
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (verifying) {
    return (
      <>
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
          <CodeVerificationForm onVerify={handleVerification} />
          {errors && <Errors errors={errors} />}
        </main>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center sm:text-left">Sign up</h1>
      <EmailPasswordForm onSubmit={handleSubmit} />
      {errors && <Errors errors={errors} />}
    </>
  )
}
