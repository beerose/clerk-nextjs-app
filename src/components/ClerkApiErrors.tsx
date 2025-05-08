import { ClerkAPIError } from "@clerk/types"

export const ClerkApiErrors = ({ errors }: { errors: ClerkAPIError[] }) => {
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