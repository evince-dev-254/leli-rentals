"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile, Send, Paperclip, Mic, X, Image as ImageIcon, FileText, Loader2 } from "lucide-react"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { IKContext, IKUpload } from "imagekitio-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

const authenticator = async () => {
    try {
        const response = await fetch("/api/imagekit/auth")
        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }
        const data = await response.json()
        const { signature, expire, token } = data
        return { signature, expire, token }
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`)
    }
}

interface ChatInputProps {
    onSendMessage: (content: string, attachments?: string[]) => void
    disabled?: boolean
    placeholder?: string
}

export function ChatInput({ onSendMessage, disabled, placeholder = "Type a message..." }: ChatInputProps) {
    const [value, setValue] = useState("")
    const [attachments, setAttachments] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const { theme } = useTheme()
    const inputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const ikUploadRef = useRef<any>(null)

    const handleSend = () => {
        if (value.trim() || attachments.length > 0) {
            onSendMessage(value, attachments)
            setValue("")
            setAttachments([])
        }
    }

    const onEmojiClick = (emojiData: any) => {
        setValue(prev => prev + emojiData.emoji)
        inputRef.current?.focus()
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `message-attachments/${fileName}`

            // For documents, we use Supabase storage
            const { data, error } = await supabase.storage
                .from('documents')
                .upload(filePath, file)

            if (error) {
                if (error.message.includes('bucket not found')) {
                    toast.error("Storage bucket 'documents' not found. Please create it in Supabase.")
                }
                throw error
            }

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath)

            setAttachments(prev => [...prev, publicUrl])
            toast.success("Document uploaded")
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(`Upload failed: ${error.message}`)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col gap-2">
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 px-2">
                    {attachments.map((url, i) => (
                        <div key={i} className="relative group">
                            <div className="h-16 w-16 rounded-lg border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center relative">
                                {url.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
                                    <Image src={url} alt="attachment" fill className="object-cover" />
                                ) : (
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                )}
                            </div>
                            <button
                                onClick={() => removeAttachment(i)}
                                className="absolute -top-1.5 -right-1.5 bg-background border border-white/10 rounded-full p-0.5 hover:text-red-500 transition-colors shadow-lg"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end gap-2 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                <div className="flex items-center gap-1">
                    <IKContext
                        publicKey={publicKey}
                        urlEndpoint={urlEndpoint}
                        authenticator={authenticator}
                    >
                        <IKUpload
                            className="hidden"
                            ref={ikUploadRef}
                            onUploadStart={() => setIsUploading(true)}
                            onSuccess={(res: any) => {
                                setAttachments(prev => [...prev, res.url])
                                setIsUploading(false)
                                toast.success("Image uploaded")
                            }}
                            onError={(err: any) => {
                                setIsUploading(false)
                                toast.error("Image upload failed")
                            }}
                        />
                    </IKContext>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                    />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-muted-foreground hover:text-primary transition-colors"
                                type="button"
                                disabled={isUploading || disabled}
                            >
                                <Paperclip className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" align="start" className="w-40 p-1 flex flex-col bg-background/95 backdrop-blur-md border-white/10">
                            <Button
                                variant="ghost"
                                className="justify-start gap-2 h-9 text-sm"
                                onClick={() => ikUploadRef.current?.click()}
                            >
                                <ImageIcon className="h-4 w-4" /> Image
                            </Button>
                            <Button
                                variant="ghost"
                                className="justify-start gap-2 h-9 text-sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FileText className="h-4 w-4" /> Document
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex-1 relative">
                    <Input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder={isUploading ? "Uploading..." : placeholder}
                        disabled={disabled || isUploading}
                        className="min-h-[40px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 text-sm md:text-base resize-none"
                    />
                </div>

                <div className="flex items-center gap-1">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-muted-foreground hover:text-yellow-500 transition-colors"
                                type="button"
                                disabled={isUploading || disabled}
                            >
                                <Smile className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" align="end" className="p-0 border-0 shadow-2xl">
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
                                skinTonesDisabled
                                searchDisabled
                                height={400}
                                width={300}
                            />
                        </PopoverContent>
                    </Popover>

                    {value.trim() || attachments.length > 0 ? (
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={disabled || isUploading}
                            className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg transition-all active:scale-95"
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground hover:text-primary transition-colors"
                            type="button"
                        >
                            <Mic className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
