"use client"

import { useState, useEffect, ReactNode } from "react"
import ProfessionalAIChat from "@/components/professional-ai-chat"
import MessagingApp from "@/components/messaging-app"

export function UIShell({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messagingState, setMessagingState] = useState({
    isOpen: false,
    participantId: undefined as string | undefined,
    listingData: undefined as any | undefined,
  });

  const toggleChat = () => setIsChatOpen(!isChatOpen)
  const toggleMessaging = () => setMessagingState(prev => ({ ...prev, isOpen: !prev.isOpen, participantId: undefined, listingData: undefined }));

  useEffect(() => {
    const handleOpenMessaging = (event: CustomEvent) => {
      const { participantId, listingData } = event.detail;
      setMessagingState({
        isOpen: true,
        participantId,
        listingData,
      });
    };

    window.addEventListener('openMessaging', handleOpenMessaging as EventListener);

    return () => {
      window.removeEventListener('openMessaging', handleOpenMessaging as EventListener);
    };
  }, []);

  return (
    <>
      {children}
      <ProfessionalAIChat isOpen={isChatOpen} onToggle={toggleChat} />
      <MessagingApp 
        isOpen={messagingState.isOpen} 
        onToggle={toggleMessaging} 
        initialParticipantId={messagingState.participantId} 
        listingData={messagingState.listingData} 
      />
    </>
  )
}