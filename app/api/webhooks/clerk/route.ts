import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models/User'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Get the Webhook secret
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  try {
    await connectDB()

    switch (eventType) {
      case 'user.created':
        const userData = evt.data
        console.log('Creating user:', userData.id)
        
        // Create user in MongoDB
        const newUser = new User({
          clerkUserId: userData.id,
          email: userData.email_addresses[0]?.email_address || '',
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          role: 'business_owner'
        })

        await newUser.save()
        console.log('User created successfully in MongoDB')
        break

      case 'user.updated':
        const updatedUserData = evt.data
        console.log('Updating user:', updatedUserData.id)
        
        // Update user in MongoDB
        await User.findOneAndUpdate(
          { clerkUserId: updatedUserData.id },
          {
            email: updatedUserData.email_addresses[0]?.email_address || '',
            firstName: updatedUserData.first_name || '',
            lastName: updatedUserData.last_name || '',
            updatedAt: new Date()
          },
          { upsert: true }
        )
        console.log('User updated successfully in MongoDB')
        break

      case 'user.deleted':
        const deletedUserData = evt.data
        console.log('Deleting user:', deletedUserData.id)
        
        // Soft delete user in MongoDB
        await User.findOneAndUpdate(
          { clerkUserId: deletedUserData.id },
          { 
            isActive: false,
            updatedAt: new Date()
          }
        )
        console.log('User soft deleted successfully in MongoDB')
        break

      default:
        console.log(`Unhandled webhook event type: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}