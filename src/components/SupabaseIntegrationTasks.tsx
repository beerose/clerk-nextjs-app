'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

function createClerkSupabaseClient(session: any) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    }
  );
}

export default function Tasks({ session, user }: { session: any; user: any }) {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  const client = createClerkSupabaseClient(session);

  useEffect(() => {
    if (!user) return;

    async function loadTasks() {
      const { data, error } = await client.from('tasks').select(
        '*',
      );
      if (!error) setTasks(data);
    }

    loadTasks();
  }, [user]);

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    if (!name) return;
    e.preventDefault();
    const res = await client.from('tasks').insert({ name }).select();
    setTasks((prev) => [...prev, res.data?.[0]]);
    setName('');
  }

  async function deleteTask(id: string) {
    const res = await client.from('tasks').delete().eq('id', id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <div>
      <h1 className="font-bold mb-4">Loads tasks from Supabase</h1>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="py-2 px-3 bg-gray-100 rounded-sm">
                <div className="flex justify-between items-center">
                  <span>{task.name}</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No tasks found</p>
        )}
      </div>

      <form onSubmit={createTask} className="mt-6 space-y-4">
        <div className="flex items-center gap-x-2">
          <input
            type="text"
            name="name"
            placeholder="New task"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3 py-2 border rounded-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-2 text-white rounded-sm bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}