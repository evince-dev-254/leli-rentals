import { NextRequest, NextResponse } from 'next/server'
import { messagingService } from '@/lib/messaging-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId') || 'user1' // Default for demo

    switch (action) {
      case 'sessions': {
        const sessions = await messagingService.getChatSessions(userId)
        return NextResponse.json({ sessions })
      }

      case 'messages': {
        const sessionId = searchParams.get('sessionId')
        if (!sessionId) {
          return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
        }

        const messages = await messagingService.getMessages(sessionId)
        return NextResponse.json({ messages })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId = 'user1' } = body // Default for demo

    switch (action) {
      case 'send': {
        const { chatSessionId, receiverId, content, type, bookingId, listingId } = body

        if (!chatSessionId || !receiverId || !content) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const messageData = {
          chatSessionId,
          senderId: userId,
          receiverId,
          content,
          type: type || 'text',
          bookingId,
          listingId
        }

        const messageId = await messagingService.sendMessage(messageData)
        return NextResponse.json({ messageId })
      }

      case 'mark-read': {
        const { sessionId } = body

        if (!sessionId) {
          return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
        }

        await messagingService.markMessagesAsRead(sessionId, userId)
        return NextResponse.json({ success: true })
      }

      case 'create-session': {
        const { participantId, listingData } = body

        if (!participantId) {
          return NextResponse.json({ error: 'Participant ID required' }, { status: 400 })
        }

        const sessionId = await messagingService.getOrCreateChatSession(
          userId,
          participantId,
          listingData
        )

        return NextResponse.json({ sessionId })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Messages API POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}