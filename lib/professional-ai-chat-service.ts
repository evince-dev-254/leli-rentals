import { db } from "./firebase"
import { collection, addDoc, query, where, getDocs, getDoc, orderBy, limit, doc, updateDoc, serverTimestamp } from "firebase/firestore"

// Professional AI Chat Service for Leli Rentals
// Features inspired by Airbnb, Booking.com, and other professional rental platforms

export interface ChatMessage {
  id: string
  sender: 'user' | 'ai' | 'agent'
  content: string
  timestamp: Date
  type: 'text' | 'quick-reply' | 'action' | 'system'
  role: string
  metadata?: {
    confidence?: number
    category?: string
    suggestedActions?: string[]
    quickReplies?: string[]
    isEscalated?: boolean
    userIntent?: string
    contextData?: any
    shouldEscalate?: boolean
    feedback?: 'positive' | 'negative'
    feedbackTimestamp?: Date
  }
}

export interface ChatSession {
  id: string
  userId?: string
  messages: ChatMessage[]
  status: 'active' | 'closed' | 'escalated'
  createdAt: Date
  updatedAt: Date
  context: {
    currentPage?: string
    userBookings?: any[]
    userListings?: any[]
    searchQuery?: string
    selectedCategory?: string
  }
  metadata: {
    userAgent?: string
    deviceType?: 'mobile' | 'desktop' | 'tablet'
    referrer?: string
    sessionStartTime?: Date
    totalMessages?: number
    satisfactionScore?: number
    escalationReason?: string
  }
}

export interface AIResponse {
  message: string
  confidence: number
  category: string
  suggestedActions: string[]
  quickReplies: string[]
  shouldEscalate: boolean
  contextUpdates?: any
  followUpQuestions?: string[]
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  action: string
  category: string
  priority: number
}

class ProfessionalAIChatService {
  private readonly API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions'

  // Quick actions available to users
  public readonly quickActions: QuickAction[] = [
    {
      id: 'book_item',
      label: 'Book an Item',
      icon: '📅',
      action: 'I want to book an item',
      category: 'booking',
      priority: 1
    },
    {
      id: 'list_item',
      label: 'List My Item',
      icon: '📦',
      action: 'I want to list an item for rent',
      category: 'listing',
      priority: 2
    },
    {
      id: 'manage_bookings',
      label: 'My Bookings',
      icon: '📋',
      action: 'Help me manage my bookings',
      category: 'account',
      priority: 3
    },
    {
      id: 'payment_help',
      label: 'Payment Issues',
      icon: '💳',
      action: 'I have a payment question',
      category: 'billing',
      priority: 4
    },
    {
      id: 'account_help',
      label: 'Account Help',
      icon: '👤',
      action: 'Help with my account',
      category: 'account',
      priority: 5
    }
  ]

  // Generate AI response with professional context
  async generateResponse(
    userMessage: string,
    session: ChatSession,
    context?: any
  ): Promise<AIResponse> {
    try {
      // Analyze user intent and context
      const analysis = await this.analyzeUserIntent(userMessage, session, context)

      // Check if we should escalate to human support
      if (this.shouldEscalateToHuman(userMessage, session, analysis)) {
        return this.createEscalationResponse(userMessage, analysis)
      }

      // Generate contextual response
      const response = await this.generateContextualResponse(userMessage, analysis, session)

      // Update session context
      await this.updateSessionContext(session.id, response.contextUpdates)

      return response
    } catch (error) {
      console.error('AI Response generation failed:', error)
      return this.generateFallbackResponse(userMessage)
    }
  }

  // Analyze user intent using NLP patterns
  private async analyzeUserIntent(
    message: string,
    session: ChatSession,
    context?: any
  ): Promise<any> {
    const message_lower = message.toLowerCase()

    // Intent patterns for rental marketplace
    const intentPatterns = {
      booking: {
        keywords: ['book', 'rent', 'reserve', 'hire', 'borrow', 'rental', 'reservation'],
        confidence: 0.9,
        actions: ['search_items', 'view_calendar', 'contact_owner']
      },
      listing: {
        keywords: ['list', 'sell', 'offer', 'rent out', 'create listing', 'add item'],
        confidence: 0.9,
        actions: ['create_listing', 'upload_photos', 'set_pricing']
      },
      account: {
        keywords: ['account', 'profile', 'login', 'password', 'verification', 'settings'],
        confidence: 0.8,
        actions: ['update_profile', 'verify_account', 'change_password']
      },
      billing: {
        keywords: ['payment', 'pay', 'money', 'fee', 'charge', 'refund', 'billing'],
        confidence: 0.9,
        actions: ['view_payments', 'update_payment_method', 'contact_support']
      },
      support: {
        keywords: ['help', 'support', 'problem', 'issue', 'question', 'how to'],
        confidence: 0.7,
        actions: ['search_faq', 'contact_support', 'live_chat']
      }
    }

    // Find matching intent
    let bestIntent = 'general'
    let maxConfidence = 0.5

    for (const [intent, config] of Object.entries(intentPatterns)) {
      const matches = config.keywords.filter(keyword =>
        message_lower.includes(keyword)
      ).length

      if (matches > 0) {
        const confidence = config.confidence * (matches / config.keywords.length)
        if (confidence > maxConfidence) {
          maxConfidence = confidence
          bestIntent = intent
        }
      }
    }

    return {
      intent: bestIntent,
      confidence: maxConfidence,
      context: this.extractContext(message_lower, session),
      suggestedActions: (intentPatterns as any)[bestIntent]?.actions || []
    }
  }

  // Extract context from message and session
  private extractContext(message: string, session: ChatSession): any {
    const context: any = {
      mentionedItems: [],
      mentionedCategories: [],
      timeReferences: [],
      locationReferences: [],
      priceReferences: []
    }

    // Extract categories mentioned
    const categories = ['vehicles', 'homes', 'electronics', 'equipment', 'sports', 'fashion']
    context.mentionedCategories = categories.filter(cat =>
      message.includes(cat.toLowerCase())
    )

    // Extract price references
    const priceMatch = message.match(/\$?\d+(?:\.\d{2})?|\d+\s*dollars?|\d+\s*kes/i)
    if (priceMatch) {
      context.priceReferences = [priceMatch[0]]
    }

    return context
  }

  // Generate contextual response
  private async generateContextualResponse(
    userMessage: string,
    analysis: any,
    session: ChatSession
  ): Promise<AIResponse> {
    const responses = {
      booking: {
        message: "I'd be happy to help you find and book the perfect rental item! What type of item are you looking for?",
        quickReplies: ["Vehicles", "Electronics", "Equipment", "Sports gear"],
        suggestedActions: ["Browse categories", "View popular items", "Search by location"]
      },
      listing: {
        message: "Great! Listing your item on Leli Rentals is easy and can earn you extra income. Let's get started with creating your listing.",
        quickReplies: ["Create listing now", "Learn about fees", "See listing tips"],
        suggestedActions: ["Start listing", "Upload photos", "Set pricing"]
      },
      account: {
        message: "I can help you manage your Leli Rentals account. What would you like to do?",
        quickReplies: ["Update profile", "Verify account", "Change password"],
        suggestedActions: ["View profile", "Account settings", "Security options"]
      },
      billing: {
        message: "I understand you have a billing question. Let me help you with payments and transactions.",
        quickReplies: ["Payment methods", "Refund status", "Billing history"],
        suggestedActions: ["View payments", "Update payment method", "Contact billing support"]
      },
      support: {
        message: "I'm here to help! What can I assist you with today?",
        quickReplies: ["General help", "Technical issues", "Contact human support"],
        suggestedActions: ["Browse FAQ", "Search help articles", "Live chat"]
      },
      general: {
        message: "Hello! I'm Leli's AI assistant, here to help you with rentals, bookings, and account management. How can I assist you today?",
        quickReplies: ["Book an item", "List my item", "Account help", "General questions"],
        suggestedActions: ["Explore rentals", "View my bookings", "Account dashboard"]
      }
    }

    const responseConfig = (responses as any)[analysis.intent] || responses.general

    return {
      message: responseConfig.message,
      confidence: analysis.confidence,
      category: analysis.intent,
      suggestedActions: responseConfig.suggestedActions,
      quickReplies: responseConfig.quickReplies,
      shouldEscalate: false,
      contextUpdates: analysis.context
    }
  }

  // Check if conversation should escalate to human
  private shouldEscalateToHuman(
    message: string,
    session: ChatSession,
    analysis: any
  ): boolean {
    const escalationTriggers = [
      'urgent', 'emergency', 'asap', 'immediately', 'crisis',
      'angry', 'frustrated', 'terrible', 'worst', 'horrible',
      'complaint', 'dispute', 'damage', 'broken', 'stolen',
      'refund', 'money back', 'compensation', 'lawyer', 'legal'
    ]

    const hasEscalationTrigger = escalationTriggers.some(trigger =>
      message.toLowerCase().includes(trigger)
    )

    const lowConfidence = analysis.confidence < 0.6
    const longConversation = session.messages.length > 15
    const repeatedIssues = this.hasRepeatedIssues(session.messages)

    return hasEscalationTrigger || lowConfidence || longConversation || repeatedIssues
  }

  // Check for repeated issues in conversation
  private hasRepeatedIssues(messages: ChatMessage[]): boolean {
    const userMessages = messages.filter(msg => msg.sender === 'user')
    if (userMessages.length < 3) return false

    const recentMessages = userMessages.slice(-3)
    const messageTexts = recentMessages.map(msg => msg.content.toLowerCase())

    // Check if user is repeating similar questions
    for (let i = 0; i < messageTexts.length - 1; i++) {
      for (let j = i + 1; j < messageTexts.length; j++) {
        if (this.messagesAreSimilar(messageTexts[i], messageTexts[j])) {
          return true
        }
      }
    }

    return false
  }

  // Check if two messages are similar
  private messagesAreSimilar(msg1: string, msg2: string): boolean {
    const words1 = msg1.split(' ').filter(word => word.length > 3)
    const words2 = msg2.split(' ').filter(word => word.length > 3)

    const commonWords = words1.filter(word => words2.includes(word))
    return commonWords.length >= Math.min(words1.length, words2.length) * 0.6
  }

  // Create escalation response
  private createEscalationResponse(userMessage: string, analysis: any): AIResponse {
    return {
      message: "I understand this is an important matter that needs personal attention. I'm connecting you with our human support team who can provide more detailed assistance. A specialist will be with you shortly.",
      confidence: 0.95,
      category: 'escalation',
      suggestedActions: ['Wait for human support', 'Prepare relevant details'],
      quickReplies: ['Continue waiting', 'Cancel escalation'],
      shouldEscalate: true
    }
  }

  // Fallback response when AI fails
  private generateFallbackResponse(userMessage: string): AIResponse {
    return {
      message: "I'm sorry, I'm having trouble processing your request right now. Let me connect you with our human support team who can help you better.",
      confidence: 0.3,
      category: 'error',
      suggestedActions: ['Contact human support', 'Try again later'],
      quickReplies: ['Connect to human', 'Try different question'],
      shouldEscalate: true
    }
  }

  // Session management
  async createSession(userId?: string): Promise<string> {
    try {
      const newSession: Omit<ChatSession, 'id'> = {
        userId,
        messages: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        context: {},
        metadata: {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
          deviceType: this.getDeviceType(),
          referrer: typeof window !== 'undefined' ? document.referrer : undefined,
          sessionStartTime: new Date(),
          totalMessages: 0
        }
      }

      const docRef = await addDoc(collection(db, 'ai_chat_sessions'), {
        ...newSession,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return docRef.id // Return the Firestore document ID directly
    } catch (error) {
      console.error('Error creating chat session:', error)
      throw new Error('Failed to create chat session')
    }
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const docRef = doc(db, 'ai_chat_sessions', sessionId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return null

      const data = docSnap.data()

      return {
        id: docSnap.id,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
        messages: data?.messages?.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp?.toDate() || new Date()
        })) || []
      } as ChatSession
    } catch (error) {
      console.error('Error getting chat session:', error)
      return null
    }
  }

  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<void> {
    try {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      }

      const sessionRef = doc(db, 'ai_chat_sessions', sessionId)
      const session = await this.getSession(sessionId)

      if (!session) throw new Error('Session not found')

      const updatedMessages = [...session.messages, newMessage]

      await updateDoc(sessionRef, {
        messages: updatedMessages,
        updatedAt: serverTimestamp(),
        'metadata.totalMessages': updatedMessages.length,
        'metadata.lastMessageTime': serverTimestamp()
      })
    } catch (error) {
      console.error('Error adding message:', error)
      throw new Error('Failed to add message')
    }
  }

  async updateSessionContext(sessionId: string, contextUpdates: any): Promise<void> {
    try {
      const sessionRef = doc(db, 'ai_chat_sessions', sessionId)
      await updateDoc(sessionRef, {
        context: contextUpdates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating session context:', error)
    }
  }

  async closeSession(sessionId: string, satisfactionScore?: number): Promise<void> {
    try {
      const sessionRef = doc(db, 'ai_chat_sessions', sessionId)
      await updateDoc(sessionRef, {
        status: 'closed',
        updatedAt: serverTimestamp(),
        'metadata.satisfactionScore': satisfactionScore
      })
    } catch (error) {
      console.error('Error closing session:', error)
    }
  }

  async submitFeedback(sessionId: string, messageId: string, feedback: 'positive' | 'negative'): Promise<void> {
    try {
      const sessionRef = doc(db, 'ai_chat_sessions', sessionId)
      const session = await this.getSession(sessionId)

      if (!session) throw new Error('Session not found')

      // Find the message and update its feedback
      const messageIndex = session.messages.findIndex(msg => msg.id === messageId)
      if (messageIndex === -1) throw new Error('Message not found')

      const updatedMessages = [...session.messages]
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        metadata: {
          ...updatedMessages[messageIndex].metadata,
          feedback,
          feedbackTimestamp: new Date()
        }
      }

      await updateDoc(sessionRef, {
        messages: updatedMessages,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  // Utility methods
  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop'

    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  // Get personalized quick actions based on user context
  getPersonalizedQuickActions(session: ChatSession): QuickAction[] {
    const actions = [...this.quickActions]

    // Prioritize based on user context
    if ((session.context.userBookings?.length || 0) > 0) {
      actions.find(a => a.id === 'manage_bookings')!.priority = 1
    }

    if ((session.context.userListings?.length || 0) > 0) {
      actions.find(a => a.id === 'list_item')!.priority = 1
    }

    return actions.sort((a, b) => a.priority - b.priority)
  }
}

export const professionalAIChatService = new ProfessionalAIChatService()