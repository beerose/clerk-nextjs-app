import { Database } from '@/src/database.types';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server'

const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    switch (eventType) {
      case 'user.created':
        console.log('New user created:', id)
        const { data, error } = await supabaseClient
          .from('users')
          .insert(
            {
              clerk_user_id: id,
              email: evt.data.email_addresses[0]?.email_address,
            },
          ).select();

        if (error) {
          console.error('Error inserting user into Supabase:', error)
          return new Response('Error inserting user into Supabase', { status: 500 })
        }
        console.log('User inserted into Supabase:', data)
        break;
      case 'user.updated':
        console.log('User updated:', id)
        const { data: updatedData, error: updateError } = await supabaseClient
          .from('users')
          .update({
            email: evt.data.email_addresses[0]?.email_address,
          })
          .eq('clerk_user_id', id!)
          .select();
        if (updateError) {
          console.error('Error updating user in Supabase:', updateError)
          return new Response('Error updating user in Supabase', { status: 500 })
        }
        console.log('User updated in Supabase:', updatedData)
        break;
      case 'user.deleted':
        console.log('User deleted:', id)
        const { data: deletedData, error: deleteError } = await supabaseClient
          .from('users')
          .delete()
          .eq('clerk_user_id', id!)
          .select();
        if (deleteError) {
          console.error('Error deleting user in Supabase:', deleteError)
          return new Response('Error deleting user in Supabase', { status: 500 })
        }
        console.log('User deleted from Supabase:', deletedData)
        break;
      default:
        console.log('Unhandled event type:', eventType)
        break;
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}