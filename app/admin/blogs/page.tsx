"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Trash2, Eye, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const fetchBlogs = async () => {
        setIsLoading(true)
        try {
            // Using the public API for consistency
            const response = await fetch("/api/blog")
            if (!response.ok) throw new Error("Failed to fetch blogs")
            const data = await response.json()
            setBlogs(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load blogs")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handleDelete = async (id: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error("Unauthorized")
                return
            }

            const response = await fetch(`/api/blog?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            })

            if (!response.ok) throw new Error("Failed to delete blog")

            toast.success("Blog post deleted")
            fetchBlogs() // Refresh list
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete blog. Please try again.")
        }
    }

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
                    <p className="text-muted-foreground">Manage ongoing articles and community updates.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchBlogs} variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button asChild className="gap-2">
                        <Link href="/blog/create">
                            <Plus className="h-4 w-4" />
                            Write New Post
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Posts ({filteredBlogs.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Stats</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBlogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No blogs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBlogs.map((blog) => (
                                        <TableRow key={blog.id}>
                                            <TableCell>
                                                <div className="h-10 w-16 rounded overflow-hidden bg-muted">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={blog.cover_image || "/placeholder.png"}
                                                        alt={blog.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate" title={blog.title}>
                                                {blog.title}
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                    {blog.category}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {blog.author_name || "Unknown"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs text-muted-foreground">
                                                    <span>⭐ {Number(blog.average_rating || 0).toFixed(1)}</span>
                                                    <span>👁️ {blog.review_count || 0} reviews</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild variant="ghost" size="icon" title="View">
                                                        <Link href={`/blog/${blog.slug}`} target="_blank">
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete this blog post?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. The post &quot;{blog.title}&quot; will be permanently removed.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(blog.id)} className="bg-destructive hover:bg-destructive/90">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div >
    )
}
