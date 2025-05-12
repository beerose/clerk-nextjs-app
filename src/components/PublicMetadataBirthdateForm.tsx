'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { updateUserMetadata } from '@/app/actions';

export default function PublicMetadataBirthdateForm() {
  const { user } = useUser();
  const [birthdate, setBirthdate] = useState(user?.publicMetadata.birthdate || '');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <p className="text-center mt-4 text-gray-600">Please sign in to update your birthdate.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserMetadata(user.id, birthdate);
      alert('Birthdate saved successfully!');
    } catch (error) {
      console.error('Failed to save birthdate:', error);
      alert('Failed to save birthdate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div><h1 className="font-bold mb-4">
      Updates user's birthdate in public metadata
    </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto flex flex-col"
      >
        <label htmlFor="birthdate" className="block mb-2 text-sm font-medium text-gray-700">
          Birthdate
        </label>
        <div className='flex gap-x-2'>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className={`ml-auto p-2 px-3 text-white font-medium rounded-sm transition ${loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
              }`}
          >
            {loading ? 'Saving...' : 'Set'}
          </button>
        </div>
      </form>
    </div>
  );
}
