'use client';

import BirthdateForm from '@/src/components/BirthdateForm';
import { useAuth, useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';

function createClerkSupabaseClient(session: any) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null
      },
    },
  )
}

export default function Home() {
  const { isSignedIn, orgId, orgRole, orgSlug } = useAuth();
  const { user } = useUser();
  const { session } = useSession();
  const [name, setName] = useState('')
  const [tasks, setTasks] = useState<any[]>([])

  console.log('orgId', orgId)
  console.log('orgRole', orgRole)
  console.log('orgSlug', orgSlug)

  const client = createClerkSupabaseClient(session)

  const birthdate = user?.publicMetadata?.birthdate as string;

  useEffect(() => {
    if (!user) return

    async function loadTasks() {
      const { data, error } = await client.from('tasks').select()
      if (!error) setTasks(data)
    }

    loadTasks()
  }, [user])

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await client.from('tasks').insert({
      name,
    })
    window.location.reload()
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 text-gray-800">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        {isSignedIn && (
          <div className="p-4 bg-white shadow-md rounded-md w-full">
            <BirthdateForm />
          </div>
        )}
        {isSignedIn && birthdate && (
          <div className="p-4 bg-white shadow-md rounded-md w-full text-center sm:text-left">
            <p className="text-lg font-medium">Welcome! Your birthdate is <span className="font-bold">{birthdate}</span>.</p>
          </div>
        )}

        <div className="p-4 bg-white shadow-md rounded-md w-full">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="p-2 bg-gray-100 rounded-md shadow-sm">
                  {task.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tasks found</p>
          )}
        </div>

        {isSignedIn && (
          <form onSubmit={createTask} className="flex gap-4 w-full mt-4">
            <input
              autoFocus
              type="text"
              name="name"
              placeholder="Enter new task"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
