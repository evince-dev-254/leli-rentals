"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Loader2,
  Phone,
  Mail,
  HelpCircle,
  MessageSquare,
  Maximize2,
  Minimize2
} from "lucide-react"
import { professionalAIChatService, ChatMessage, ChatSession, AIResponse } from "@/lib/professional-ai-chat-service"
import { enhancedAIChatService } from "@/lib/enhanced-ai-chat-service"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ProfessionalAIChatProps {
  isOpen: boolean
  onToggle: () => void
}

export default function ProfessionalAIChat({ isOpen, onToggle }: ProfessionalAIChatProps) {
  const { user, isLoaded } = useUser()
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [suggestedActions, setSuggestedActions] = useState<string[]>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize session
  useEffect(() => {
    if (isOpen && !session) {
      initializeSession()
    }
  }, [isOpen, session])

  const initializeSession = async () => {
    try {
      const sessionId = await professionalAIChatService.createSession(user?.id)

      // Load previous conversation history if exists
      const previousMessages = enhancedAIChatService.loadConversationHistory(sessionId)

      // Get user context for personalization
      const userContext = await enhancedAIChatService.getUserContext(user?.id)

      const contextData = {
        currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
        deviceType: typeof window !== 'undefined' ?
          (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'desktop',
        ...userContext
      }

      setSession({
        id: sessionId,
        userId: user?.id,
        messages: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        context: contextData,
        metadata: {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
          deviceType: contextData.deviceType,
          sessionStartTime: new Date(),
          totalMessages: previousMessages.length
        }
      })

      // If there's previous conversation, load it
      if (previousMessages.length > 0) {
        setMessages(previousMessages)
        setShowWelcome(false)
      } else {
        // Generate personalized welcome message
        const personalizedGreeting = enhancedAIChatService.generatePersonalizedGreeting(
          userContext,
          user?.firstName
        )

        const contextualSuggestions = enhancedAIChatService.getContextualSuggestions(userContext)

        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          sender: 'ai',
          type: 'text',
          role: 'assistant',
          content: `${personalizedGreeting}

I can help you with:
${contextualSuggestions.map((s, i) => `${i === 0 ? '•' : '•'} ${s}`).join('\n')}

What can I help you with today?`,
          timestamp: new Date(),
          metadata: {
            quickReplies: contextualSuggestions.slice(0, 4)
          }
        }

        setMessages([welcomeMessage])
        setQuickReplies([...contextualSuggestions.slice(0, 4), '💬 Chat on WhatsApp'])
      }
    } catch (error) {
      console.error('Error initializing session:', error)
    }
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !session) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      type: 'text',
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)
    setShowWelcome(false)

    try {
      // Add user message to session
      await professionalAIChatService.addMessage(session.id, userMessage)

      // Get AI response
      const response = await professionalAIChatService.generateResponse(
        content,
        { ...session, messages: [...messages, userMessage] },
        { user }
      )

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        type: 'text',
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        metadata: {
          confidence: response.confidence,
          category: response.category,
          quickReplies: response.quickReplies,
          suggestedActions: response.suggestedActions,
          shouldEscalate: response.shouldEscalate
        }
      }

      setMessages(prev => [...prev, aiMessage])
      setQuickReplies(response.quickReplies || [])
      setSuggestedActions(response.suggestedActions || [])

      // Add AI message to session
      await professionalAIChatService.addMessage(session.id, aiMessage)

      // Save conversation history
      const updatedMessages = [...messages, userMessage, aiMessage]
      enhancedAIChatService.saveConversationHistory(session.id, updatedMessages)

    } catch (error) {
      console.error('Error sending message:', error)

      // Enhanced error handling with different messages based on error type
      let errorContent = 'I apologize, but I\'m experiencing technical difficulties. Let me connect you with our human support team.'

      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorContent = 'I\'m having trouble connecting to our servers. Please check your internet connection and try again.'
        } else if (error.message.includes('timeout')) {
          errorContent = 'The request is taking longer than expected. Please try again in a moment.'
        } else if (error.message.includes('unauthorized') || error.message.includes('permission')) {
          errorContent = 'I need to verify your account to continue. Please make sure you\'re logged in and try again.'
        }
      }

      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        sender: 'ai',
        type: 'text',
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        metadata: {
          shouldEscalate: true,
          errorType: 'technical',
          retryable: true
        }
      }
      setMessages(prev => [...prev, errorMessage])

      // Add retry option for certain errors
      if (errorMessage.metadata?.retryable) {
        setQuickReplies(['Try again', 'Contact human support', '💬 Chat on WhatsApp'])
      }
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    if (reply === '💬 Chat on WhatsApp') {
      handleWhatsAppDirect()
    } else {
      handleSendMessage(reply)
    }
  }

  const handleSuggestedAction = (action: string) => {
    console.log('Suggested action:', action)
  }

  const handleFeedback = async (messageId: string, feedback: 'positive' | 'negative') => {
    if (session) {
      try {
        await professionalAIChatService.submitFeedback(session.id, messageId, feedback)

        // Show feedback confirmation
        const feedbackMessage = feedback === 'positive' ? 'Thank you for your positive feedback!' : 'Thank you for your feedback. We\'ll use it to improve our service.'

        // Add a temporary feedback confirmation message
        const feedbackConfirmation: ChatMessage = {
          id: `feedback_${Date.now()}`,
          sender: 'ai',
          type: 'text',
          role: 'assistant',
          content: feedbackMessage,
          timestamp: new Date(),
          metadata: { isFeedbackConfirmation: true }
        }

        setMessages(prev => [...prev, feedbackConfirmation])

        // Remove the feedback confirmation after 3 seconds
        setTimeout(() => {
          setMessages(prev => prev.filter(msg => msg.id !== feedbackConfirmation.id))
        }, 3000)

      } catch (error) {
        console.error('Error submitting feedback:', error)
      }
    }
  }

  const handleEscalate = () => {
    // Open WhatsApp or email support
    const whatsappNumber = "+254112081866"
    const message = encodeURIComponent(`Hi, I need help with Leli Rentals. I was chatting with the AI assistant but need to speak with a human.`)
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${message}`

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleWhatsAppDirect = () => {
    // Direct WhatsApp contact for AI assistant
    const whatsappNumber = "+254112081866"
    const message = encodeURIComponent(`Hi Leli AI Assistant! I'm contacting you directly via WhatsApp.`)
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${message}`

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <AnimatePresence>
      {!isOpen ? (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={onToggle}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 animate-pulse transition-all duration-300 hover:scale-110"
            size="icon"
            aria-label="Open AI Support Chat"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-white/20",
            isExpanded ? "w-[90vw] h-[80vh] max-w-4xl" : "w-[90vw] sm:w-96 h-[600px] max-h-[80vh]"
          )}
        >
          {/* Glassmorphic Background */}
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl" />

          {/* Animated Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                <Avatar className="h-10 w-10 border-2 border-white/20 relative z-10">
                  <AvatarImage src="/logo-white.svg" alt="Leli AI" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full z-20" />
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  Leli Assistant
                  <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
                </h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                onClick={onToggle}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <Avatar className="h-8 w-8 flex-shrink-0 border border-white/10 shadow-sm">
                    {message.role === 'assistant' ? (
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {user?.firstName?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Message Bubble */}
                  <div className="flex flex-col gap-1">
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm shadow-sm relative group",
                        message.role === 'user'
                          ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none"
                      )}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                      {/* Message Metadata */}
                      <div className={cn(
                        "flex items-center justify-between mt-1 text-[10px]",
                        message.role === 'user' ? "text-blue-100" : "text-gray-400"
                      )}>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                        {message.role === 'assistant' && message.metadata?.shouldEscalate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1.5 text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 ml-2"
                            onClick={handleEscalate}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Escalate
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Feedback Actions (AI only) */}
                    {message.role === 'assistant' && !message.metadata?.shouldEscalate && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                        <button
                          onClick={() => handleFeedback(message.id, 'positive')}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-green-500 transition-colors"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'negative')}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-end gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0 border border-white/10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions / Suggestions */}
          {(quickReplies.length > 0 || suggestedActions.length > 0) && (
            <div className="relative z-10 p-3 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 backdrop-blur-sm">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[...quickReplies, ...suggestedActions].slice(0, 5).map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 text-xs h-8 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all rounded-full"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="relative z-10 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <input
                type="text"
                placeholder="Ask anything..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage(newMessage)}
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-200",
                  newMessage.trim()
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:scale-105"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
                disabled={!newMessage.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center mt-2">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                Powered by Leli AI <Sparkles className="h-2 w-2" />
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
