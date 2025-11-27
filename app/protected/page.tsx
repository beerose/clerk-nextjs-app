export default function ProtectedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <main className="w-full max-w-md p-6 bg-white rounded shadow">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Welcome to the protected page!</h1>
          <p className="mt-4 text-gray-600">
            You are successfully signed in and can access this content.
          </p>
        </div>
      </main>
    </div>
  );
}
