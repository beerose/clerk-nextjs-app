import { useReverification, useUser } from "@clerk/nextjs"
import { isClerkAPIResponseError } from "@clerk/nextjs/errors"
import { BackupCodeResource, ClerkAPIError } from "@clerk/types"
import { useEffect, useState } from "react"

export function BackupCodes({
  setErrors,
}: {
  errors: ClerkAPIError[] | undefined
  setErrors: React.Dispatch<React.SetStateAction<ClerkAPIError[] | undefined>>
}) {
  const { user } = useUser()
  const [backupCodes, setBackupCodes] = useState<BackupCodeResource | undefined>(undefined)
  const createBackupCode = useReverification(() => user?.createBackupCode())

  const [loading, setLoading] = useState(false)

  useEffect(() => {
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