'use client'

import { useUser, useReverification } from '@clerk/nextjs'
import { ClerkAPIError, TOTPResource } from '@clerk/types'
import Link from 'next/link'
import * as React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { GenerateBackupCodes } from '../page'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { ClerkApiErrors } from '@/src/components/ClerkApiErrors'

type AddTotpSteps = 'add' | 'verify' | 'backupcodes' | 'success'

type DisplayFormat = 'qr' | 'uri'

function AddTotpScreen({
  setStep,
  setErrors,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>
  errors: ClerkAPIError[] | undefined
  setErrors: React.Dispatch<React.SetStateAction<ClerkAPIError[] | undefined>>
}) {
  const { user } = useUser()
  const [totp, setTOTP] = React.useState<TOTPResource | undefined>(undefined)
  const [displayFormat, setDisplayFormat] = React.useState<DisplayFormat>('qr')
  const createTOTP = useReverification(() => user?.createTOTP())

  React.useEffect(() => {
    setErrors(undefined)
    void createTOTP()
      .then((totp: TOTPResource | undefined) => {
        setTOTP(totp)
      })
      .catch((err) => {
        if (isClerkAPIResponseError(err)) setErrors(err.errors)
        console.error(JSON.stringify(err, null, 2))
      })
  }, [])

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add TOTP MFA</h1>

      {totp && displayFormat === 'qr' && (
        <div className="mb-4">
          <div className="flex justify-center mb-4">
            <QRCodeSVG value={totp?.uri || ''} size={200} />
          </div>
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setDisplayFormat('uri')}
          >
            Use URI instead
          </button>
        </div>
      )}
      {totp && displayFormat === 'uri' && (
        <div className="mb-4">
          <p className="break-all bg-gray-100 p-2 rounded">{totp.uri}</p>
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setDisplayFormat('qr')}
          >
            Use QR Code instead
          </button>
        </div>
      )}
      <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded mb-4"
        onClick={() => setStep('add')}
      >
        Reset
      </button>

      <p className="mb-4">Once you have set up your authentication app, verify your code</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={() => setStep('verify')}
      >
        Verify
      </button>
    </div>
  )
}

function VerifyTotpScreen({
  setStep,
  setErrors,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>
  errors: ClerkAPIError[] | undefined
  setErrors: React.Dispatch<React.SetStateAction<ClerkAPIError[] | undefined>>
}) {
  const { user } = useUser()
  const [code, setCode] = React.useState('')

  const verifyTotp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors(undefined)
    try {
      await user?.verifyTOTP({ code })
      setStep('backupcodes')
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
      } else {
        console.error(JSON.stringify(err, null, 2))
      }
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Verify TOTP</h1>
      <form onSubmit={(e) => verifyTotp(e)} className="space-y-4">
        <label htmlFor="totp-code" className="block text-gray-700">
          Enter the code from your authentication app
        </label>
        <input
          type="text"
          id="totp-code"
          className="w-full border border-gray-300 rounded p-2"
          onChange={(e) => setCode(e.currentTarget.value)}
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Verify code
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
            onClick={() => setStep('add')}
          >
            Reset
          </button>
        </div>
      </form>
    </div >
  )
}

function BackupCodeScreen({
  setStep,
  errors,
  setErrors,
}: {
  setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>>
  errors: ClerkAPIError[] | undefined
  setErrors: React.Dispatch<React.SetStateAction<ClerkAPIError[] | undefined>>
}) {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Verification was a success!</h1>
      <div className="space-y-4">
        <p>
          Save this list of backup codes somewhere safe in case you need to access your account in
          an emergency
        </p>
        <GenerateBackupCodes errors={errors} setErrors={setErrors} />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => setStep('success')}
        >
          Finish
        </button>
      </div>
    </div>
  )
}

function SuccessScreen() {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Success!</h1>
      <p>You have successfully added TOTP MFA via an authentication application.</p>
    </div>
  )
}

export default function AddMFaScreen() {
  const [step, setStep] = React.useState<AddTotpSteps>('add')
  const [errors, setErrors] = React.useState<ClerkAPIError[] | undefined>(undefined)
  const { isLoaded, user } = useUser()

  if (!isLoaded) return null

  if (!user) {
    return <p className="text-center text-red-500">You must be logged in to access this page</p>
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      {step === 'add' && <AddTotpScreen setStep={setStep} errors={errors} setErrors={setErrors} />}
      {step === 'verify' && <VerifyTotpScreen setStep={setStep} errors={errors} setErrors={setErrors} />}
      {step === 'backupcodes' && <BackupCodeScreen setStep={setStep} errors={errors} setErrors={setErrors} />}
      {step === 'success' && <SuccessScreen />}
      {errors && <ClerkApiErrors errors={errors} />}
      <Link href="/custom/mfa" className="text-blue-500 hover:underline block mt-4">
        Back to MFA settings
      </Link>
    </div>
  )
}