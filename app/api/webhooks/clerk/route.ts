import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient } from '@clerk/nextjs/server'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    console.warn('CLERK_WEBHOOK_SECRET is not set. Skipping webhook verification.')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Get the Svix headers for verification
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Error occurred -- no svix headers' },
      { status: 400 }
    )
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json(
      { error: 'Error occurred -- verification failed' },
      { status: 400 }
    )
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    try {
      const client = await clerkClient()
      
      // DO NOT set accountType automatically - let user choose
      // Only set a flag that account type needs to be selected
      await client.users.updateUserMetadata(id, {
        unsafeMetadata: {
          accountType: 'not_selected', // Flag that account type needs selection
          needsAccountTypeSelection: true,
          createdAt: new Date().toISOString(),
        }
      })

      console.log(`✅ User ${id} created - account type selection required`)
    } catch (error) {
      console.error('Error updating user metadata:', error)
    }
  }

  return NextResponse.json({ received: true })
}

