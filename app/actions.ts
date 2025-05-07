'use server'

import { clerkClient } from '@clerk/nextjs/server';

export default async function updateUserMetadata(userId: string, birthdate: string) {
  console.log('Updating user metadata:', userId, birthdate);

  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        birthdate: birthdate,
      },
    });

    console.log('Birthdate saved:', JSON.stringify(res, null, 2));
  } catch (error) {
    console.error('Failed to save birthdate:', error);
  } finally {
    return {};
  }
}