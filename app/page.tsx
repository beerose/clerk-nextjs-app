'use client';

import PublicMetadataBirthdateForm from '@/src/components/PublicMetadataBirthdateForm';
import SupabaseIntegrationTasks from '@/src/components/SupabaseIntegrationTasks';
import { useAuth, useSession, useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { session } = useSession();

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <main className="w-full max-w-md p-6 bg-white rounded shadow">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">
              Hi there!
            </h1>
            <p className="mt-4 text-gray-600">
              Please sign in to access the app.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <main className="w-full max-w-md p-6 bg-white rounded shadow">
        {isSignedIn && <PublicMetadataBirthdateForm />}

        <div className="my-6 border-t border-gray-300" />

        {isSignedIn && <SupabaseIntegrationTasks session={session} user={user} />}
      </main>
    </div>
  );
}
