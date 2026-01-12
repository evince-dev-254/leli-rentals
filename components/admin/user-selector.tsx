"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSelectableUsers } from "@/lib/actions/dashboard-actions"
import { Skeleton } from "@/components/ui/skeleton"

interface UserSelectorProps {
    onSelect: (user: any) => void
    excludeRoles?: string[]
    placeholder?: string
    disabled?: boolean
}

export function UserSelector({ onSelect, excludeRoles = [], placeholder = "Select a user...", disabled = false }: UserSelectorProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await getSelectableUsers()
                setUsers(data)
            } catch (error) {
                console.error("Failed to load users:", error)
            } finally {
                setLoading(false)
            }
        }
        loadUsers()
    }, [])

    const filteredUsers = users.filter(user => {
        if (excludeRoles.includes(user.role)) return false
        if (user.is_admin && excludeRoles.includes('admin')) return false
        return true
    })

    const selectedUser = users.find((user) => user.email === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-12 px-4 font-normal"
                    disabled={disabled || loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ) : selectedUser ? (
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={selectedUser.avatar_url} />
                                <AvatarFallback className="text-[10px]">
                                    {selectedUser.full_name?.charAt(0) || <User className="h-3 w-3" />}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate">
                                {selectedUser.full_name} ({selectedUser.email})
                            </span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Search users by name or email..." className="h-11" />
                    <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <CommandEmpty className="py-6 text-center text-sm">No user found.</CommandEmpty>
                        <CommandGroup heading="Available Users" className="px-2 pb-2">
                            {filteredUsers.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={`${user.full_name} ${user.email}`}
                                    onSelect={() => {
                                        setValue(user.email)
                                        setOpen(false)
                                        onSelect(user)
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-accent transition-colors"
                                >
                                    <div className="relative shrink-0">
                                        <Avatar className="h-10 w-10 border border-border/50">
                                            <AvatarImage src={user.avatar_url} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {user.full_name?.charAt(0) || <User className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                                    </div>
                                    <div className="flex flex-col flex-1 overflow-hidden">
                                        <span className="font-semibold text-sm truncate">{user.full_name || "No Name"}</span>
                                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Badge variant="outline" className="text-[10px] h-4 px-1 capitalize">
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "ml-auto flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                                        value === user.email ? "bg-primary border-primary scale-110" : "border-muted-foreground/30 opacity-50"
                                    )}>
                                        {value === user.email && <Check className="h-3 w-3 text-primary-foreground" />}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
