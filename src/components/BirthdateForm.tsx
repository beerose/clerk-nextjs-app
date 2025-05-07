'use client'

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import updateUserMetadata from '@/app/actions';

export default function BirthdateForm() {
  const { user } = useUser();

  if (!user) {
    return <p>Please sign in to update your birthdate.</p>;
  }

  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const _res = await updateUserMetadata(user.id, birthdate);
      alert('Birthdate saved successfully!');
    } catch (error) {
      console.error('Failed to save birthdate:', error);
      alert('Failed to save birthdate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 max-w-md mx-auto rounded-md">
      <label htmlFor="birthdate" className="text-lg font-medium text-gray-700">
        Enter your birthdate:
      </label>
      <input
        type="date"
        id="birthdate"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        required
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={loading}
        className={`p-2 rounded-md text-white ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        {loading ? 'Saving...' : 'Set Birthdate'}
      </button>
    </form>
  );
}