export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-center items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 text-gray-800">
      <main className="flex flex-col gap-8 items-center sm:items-start w-full sm:max-w-xl">
        {children}
      </main>
    </div>
  )
}
