'use server'

import { clerkClient } from '@clerk/nextjs/server';

export async function updateUserMetadata(userId: string, birthdate: string) {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        birthdate: birthdate,
      },
    });
  } catch (error) {
    console.error('Failed to save birthdate:', error);
  } finally {
    return {};
  }
}