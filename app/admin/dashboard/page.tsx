'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  Eye,
  Reply,
  Assign,
  Archive,
  Filter,
  Search,
  Bell,
  Mail,
  Phone,
  Calendar,
  BarChart3
} from 'lucide-react'

interface AdminNotification {
  id: string
  type: 'new_ticket' | 'ticket_response' | 'billing_issue' | 'user_verification'
  ticketId?: string
  ticketNumber?: string
  subject?: string
  priority?: string
  userId: string
  userName: string
  message?: string
  createdAt: Date
  isRead: boolean
}

interface ContactTicket {
  id: string
  ticketNumber: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  userId: string
  userEmail: string
  userName: string
  createdAt: Date
  updatedAt: Date
  responses: any[]
}

interface UserStats {
  totalUsers: number
  newUsers: number
  verifiedUsers: number
  activeUsers: number
}

interface RevenueStats {
  totalRevenue: number
  monthlyRevenue: number
  pendingPayments: number
  completedPayments: number
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [tickets, setTickets] = useState<ContactTicket[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    newUsers: 0,
    verifiedUsers: 0,
    activeUsers: 0
  })
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<ContactTicket | null>(null)
  const [adminResponse, setAdminResponse] = useState('')
  const [ticketStatus, setTicketStatus] = useState('')

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Firebase removed - using mock data
        setNotifications([])
        setTickets([])
        setUserStats({
          totalUsers: 0,
          newUsers: 0,
          verifiedUsers: 0,
          activeUsers: 0
        })
        setRevenueStats({
          totalRevenue: 125000,
          monthlyRevenue: 15000,
          pendingPayments: 2500,
          completedPayments: 122500
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching admin data:', error)
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to load admin dashboard",
          variant: "destructive"
        })
      }
    }

    fetchAdminData()
  }, [toast])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Firebase removed - simulating notification mark as read
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleUpdateTicketStatus = async (ticketId: string, status: string) => {
    try {
      // Firebase removed - simulating ticket status update
      await new Promise(resolve => setTimeout(resolve, 500))

      toast({
        title: "Success",
        description: "Ticket status updated successfully"
      })
    } catch (error) {
      console.error('Error updating ticket status:', error)
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      })
    }
  }

  const handleAddAdminResponse = async (ticketId: string) => {
    if (!adminResponse.trim()) return

    try {
      const ticket = tickets.find(t => t.id === ticketId)
      if (ticket) {
        const newResponse = {
          message: adminResponse,
          isFromAdmin: true,
          adminName: 'Admin',
          createdAt: new Date()
        }

        // Firebase removed - simulating admin response
        await new Promise(resolve => setTimeout(resolve, 500))

        toast({
          title: "Success",
          description: "Response added successfully"
        })

        setAdminResponse('')
        setSelectedTicket(null)
      }
    } catch (error) {
      console.error('Error adding admin response:', error)
      toast({
        title: "Error",
        description: "Failed to add response",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-gray-100 text-gray-800'
      case 'closed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_ticket':
        return <MessageSquare className="h-4 w-4" />
      case 'ticket_response':
        return <Reply className="h-4 w-4" />
      case 'billing_issue':
        return <DollarSign className="h-4 w-4" />
      case 'user_verification':
        return <Users className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your platform and support users</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{userStats.newUsers} new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tickets.filter(t => t.status === 'open').length} open
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${revenueStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ${revenueStats.monthlyRevenue.toLocaleString()} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => !n.isRead).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {notifications.filter(n => !n.isRead && n.type === 'new_ticket').length} new tickets
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>Latest support tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-sm text-gray-600">{ticket.userName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{notification.userName}</p>
                        <p className="text-sm text-gray-600">
                          {notification.type === 'new_ticket' ? 'Created new ticket' : 'Responded to ticket'}
                        </p>
                      </div>
                      <Badge variant={notification.isRead ? 'secondary' : 'default'}>
                        {notification.isRead ? 'Read' : 'New'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <Button
              onClick={() => {
                notifications.forEach(n => {
                  if (!n.isRead) {
                    handleMarkAsRead(n.id)
                  }
                })
              }}
            >
              Mark All as Read
            </Button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`${!notification.isRead ? 'border-blue-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.userName}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={notification.isRead ? 'secondary' : 'default'}>
                            {notification.isRead ? 'Read' : 'New'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {notification.createdAt.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {notification.type === 'new_ticket' && `Created ticket: ${notification.subject}`}
                        {notification.type === 'ticket_response' && `Responded to ticket: ${notification.ticketNumber}`}
                        {notification.type === 'billing_issue' && 'Reported billing issue'}
                        {notification.type === 'user_verification' && 'Requested account verification'}
                      </p>
                      {notification.message && (
                        <p className="text-sm text-gray-500 mt-2">{notification.message}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      {notification.ticketId && (
                        <Button
                          size="sm"
                          onClick={() => {
                            const ticket = tickets.find(t => t.id === notification.ticketId)
                            if (ticket) setSelectedTicket(ticket)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Support Tickets</h2>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{ticket.userName}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{ticket.userEmail}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{ticket.createdAt.toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.responses.length} responses</span>
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{ticket.description}</p>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Select value={ticketStatus} onValueChange={(value) => {
                          setTicketStatus(value)
                          handleUpdateTicketStatus(ticket.id, value)
                        }}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Change Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>User registration over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">+{userStats.newUsers}</div>
                <p className="text-sm text-gray-600">New users this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Platform revenue metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">${revenueStats.monthlyRevenue.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Revenue this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Metrics</CardTitle>
                <CardDescription>Customer support performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {tickets.filter(t => t.status === 'resolved').length}
                </div>
                <p className="text-sm text-gray-600">Tickets resolved</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTicket.subject}</DialogTitle>
              <DialogDescription>
                Ticket #{selectedTicket.ticketNumber} • {selectedTicket.userName} • {selectedTicket.userEmail}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="flex items-center space-x-4">
                <Badge className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority}
                </Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status}
                </Badge>
                <span className="text-sm text-gray-600">
                  Created {selectedTicket.createdAt.toLocaleDateString()}
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {/* Responses */}
              <div>
                <h4 className="font-semibold mb-4">Conversation</h4>
                <div className="space-y-4">
                  {selectedTicket.responses.map((response, index) => (
                    <div key={index} className={`p-4 rounded-lg ${
                      response.isFromAdmin ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {response.isFromAdmin ? 'Admin' : selectedTicket.userName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {response.createdAt.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{response.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Response */}
              <div>
                <h4 className="font-semibold mb-2">Add Admin Response</h4>
                <div className="space-y-2">
                  <Textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Type your response here..."
                    rows={4}
                  />
                  <Button 
                    onClick={() => handleAddAdminResponse(selectedTicket.id)}
                    disabled={!adminResponse.trim()}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

