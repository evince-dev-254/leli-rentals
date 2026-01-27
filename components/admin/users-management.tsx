"use client";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  Mail,
  Download,
  UserPlus,
  Trash2,
  Send,
  X,
  Users,
  Shield,
  ShieldOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/types";
import {
  suspendUsers,
  reactivateUsers,
  deleteUsers,
  sendBulkReminders,
  toggleSuperAdmin,
  getAmISuperAdmin,
} from "@/lib/actions/admin-actions";
import { ActionConfirmModal } from "./action-confirm-modal";
import {
  getAdminUsersData,
  updateProfile,
} from "@/lib/actions/dashboard-actions";
import { promoteToStaff } from "@/lib/actions/staff-actions";

export function UsersManagement() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(
    searchParams.get("role") || "all",
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string, isSuperAdmin: boolean } | null>(null);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

  // Bulk Actions State
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderSubject, setReminderSubject] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");

  // Consent Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "default" | "destructive" | "warning";
    confirmText?: string;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => { },
    variant: "default",
  });

  const isSuperAdmin = currentUser?.isSuperAdmin || false;

  // Filter users fetched from Supabase
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.accountStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  async function loadUsers() {
    setLoadingUsers(true);
    try {
      const data = await getAdminUsersData();

      // Map DB fields to the User interface expected by this component
      const mapped: User[] = (data || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        fullName: u.full_name ?? "",
        phone: u.phone ?? "",
        avatarUrl: u.avatar_url ?? null,
        role: (u.role as any) ?? "renter",
        accountStatus: (u.account_status as any) ?? "active",
        verificationStatus:
          (u.verification_status as any) ||
          (u.role === "owner" ? "pending" : null),
        verificationDeadline: u.verification_deadline
          ? new Date(u.verification_deadline)
          : null,
        verificationDocuments: [],
        subscriptionPlan: (u.subscription_plan as any) ?? null,
        subscriptionExpiresAt: u.subscription_expires_at
          ? new Date(u.subscription_expires_at)
          : null,
        createdAt: u.created_at ? new Date(u.created_at) : new Date(),
        updatedAt: u.updated_at ? new Date(u.updated_at) : new Date(),
        lastLoginAt: u.last_login_at ? new Date(u.last_login_at) : null,
        affiliateCode: u.affiliate_code ?? null,
        isReferred: u.is_referred ?? false,
        referredBy: u.referrer?.full_name ?? u.referred_by ?? null,
        totalReferrals: u.total_referrals ?? 0,
        totalEarnings: u.total_earnings ?? 0,
        isStaff: !!u.is_staff,
        isAdmin: !!u.is_admin,
        isSuperAdmin: !!u.is_super_admin,
      }));

      setUsers(mapped);

      // Fetch current user status for permission gating using secure server action
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          // Use server action to bypass RLS and get true status
          const isSuper = await getAmISuperAdmin();
          setCurrentUser({ id: user.id, isSuperAdmin: isSuper });
        } catch (e) {
          console.error("Failed to check super admin status:", e);
          // Fallback to false
          setCurrentUser({ id: user.id, isSuperAdmin: false });
        }
      }

    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, userId]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  // Action Handlers
  const handleBulkSuspend = async (ids?: string[]) => {
    const targetIds = ids || selectedUserIds;
    if (targetIds.length === 0) return;

    setConfirmModal({
      open: true,
      title: "Confirm Suspension",
      description: `Are you sure you want to suspend ${targetIds.length} user(s)? They will not be able to log in.`,
      variant: "warning",
      confirmText: "Suspend",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await suspendUsers(targetIds);
        setActionLoading(false);
        setConfirmModal((prev) => ({ ...prev, open: false }));

        if (result.success) {
          toast({ title: "Success", description: "Users suspended successfully" });
          loadUsers();
          setSelectedUserIds([]);
        } else {
          toast({ title: "Error", description: "Failed to suspend users", variant: "destructive" });
        }
      }
    });
  };

  const handleBulkReactivate = async (ids?: string[]) => {
    const targetIds = ids || selectedUserIds;
    if (targetIds.length === 0) return;

    setConfirmModal({
      open: true,
      title: "Confirm Reactivation",
      description: `Are you sure you want to reactivate ${targetIds.length} user(s)?`,
      variant: "default",
      confirmText: "Reactivate",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await reactivateUsers(targetIds);
        setActionLoading(false);
        setConfirmModal((prev) => ({ ...prev, open: false }));

        if (result.success) {
          toast({ title: "Success", description: "Users reactivated successfully" });
          loadUsers();
          setSelectedUserIds([]);
        } else {
          toast({ title: "Error", description: "Failed to reactivate users", variant: "destructive" });
        }
      }
    });
  };

  const handleBulkDelete = async (ids?: string[]) => {
    const targetIds = ids || selectedUserIds;
    if (targetIds.length === 0) return;

    setConfirmModal({
      open: true,
      title: "DELETE USERS PERMANENTLY",
      description: `Are you sure you want to PERMANENTLY DELETE ${targetIds.length} user(s)? This will remove all their data and cannot be undone.`,
      variant: "destructive",
      confirmText: "Delete Permanently",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await deleteUsers(targetIds);
        setActionLoading(false);
        setConfirmModal((prev) => ({ ...prev, open: false }));

        if (result.success) {
          toast({ title: "Success", description: "Users deleted successfully" });
          loadUsers();
          setSelectedUserIds([]);
        } else {
          toast({ title: "Error", description: result.error || "Failed to delete users", variant: "destructive" });
        }
      }
    });
  };

  const handleSendReminder = async () => {
    if (!reminderSubject || !reminderMessage) {
      toast({
        title: "Error",
        description: "Please provide a subject and message",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    const result = await sendBulkReminders(
      selectedUserIds,
      reminderSubject,
      reminderMessage,
    );
    setActionLoading(false);

    if (result.success) {
      toast({
        title: "Success",
        description: `Reminders sent to ${result.count} users`,
      });
      setReminderOpen(false);
      setReminderSubject("");
      setReminderMessage("");
      setSelectedUserIds([]);
    } else {
      toast({
        title: "Error",
        description: "Failed to send reminders",
        variant: "destructive",
      });
    }
  };

  const handleToggleAdmin = async (user: User) => {
    const nextValue = !user.isAdmin;
    setConfirmModal({
      open: true,
      title: nextValue ? "Promote to Admin" : "Revoke Admin Access",
      description: `Are you sure you want to ${nextValue ? "promote" : "revoke"} admin access for ${user.fullName}?`,
      variant: nextValue ? "default" : "warning",
      confirmText: nextValue ? "Promote" : "Revoke",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await updateProfile(user.id, { is_admin: nextValue });
        setActionLoading(false);
        setConfirmModal((prev) => ({ ...prev, open: false }));

        if (result.success) {
          toast({ title: "Success", description: `User admin status updated` });
          loadUsers();
        } else {
          toast({ title: "Error", description: result.error || "Failed to update admin status", variant: "destructive" });
        }
      }
    });
  };

  const handleToggleStaff = async (user: User) => {
    const nextValue = !user.isStaff;
    setConfirmModal({
      open: true,
      title: nextValue ? "Promote to Staff" : "Revoke Staff Access",
      description: `Are you sure you want to ${nextValue ? "promote" : "revoke"} staff access for ${user.fullName}?`,
      variant: nextValue ? "default" : "warning",
      confirmText: nextValue ? "Promote" : "Revoke",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await updateProfile(user.id, { is_staff: nextValue });
        setActionLoading(false);
        setConfirmModal((prev) => ({ ...prev, open: false }));

        if (result.success) {
          toast({ title: "Success", description: `User staff status updated` });
          loadUsers();
        } else {
          toast({ title: "Error", description: result.error || "Failed to update staff status", variant: "destructive" });
        }
      }
    });
  };

  const handleToggleSuperAdmin = async (user: User) => {
    // Only allow if current viewer is super admin (double check)
    if (!isSuperAdmin) return;

    setConfirmModal({
      open: true,
      title: user.isSuperAdmin ? "Revoke Super Admin" : "Promote to Super Admin",
      description: `Are you sure you want to ${user.isSuperAdmin ? "revoke" : "grant"} Super Admin privileges for ${user.fullName}? This is a high-level permission.`,
      variant: user.isSuperAdmin ? "warning" : "default",
      confirmText: user.isSuperAdmin ? "Revoke" : "Promote",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await toggleSuperAdmin(user.id);
        setActionLoading(false);
        setConfirmModal((prev) => ({ ...prev, open: false }));

        if (result.success) {
          toast({ title: "Success", description: `Super Admin status updated` });
          loadUsers();
        } else {
          toast({ title: "Error", description: result.error || "Failed to update status", variant: "destructive" });
        }
      }
    });
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setConfirmModal({
      open: true,
      title: "Update User Role",
      description: `Are you sure you want to change this user's role to ${newRole}?`,
      variant: "default",
      confirmText: "Update Role",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await updateProfile(userId, { role: newRole });
        setActionLoading(false);
        setConfirmModal((prev) => ({ ...prev, open: false }));

        if (result.success) {
          toast({ title: "Success", description: `User role updated to ${newRole}` });
          loadUsers();
        } else {
          toast({ title: "Error", description: result.error || "Failed to update role", variant: "destructive" });
        }
      }
    });
  };

  const handleApproveStaff = async (user: User) => {
    setConfirmModal({
      open: true,
      title: "Approve Staff Request",
      description: `Are you sure you want to approve the staff request for ${user.fullName}?`,
      variant: "default",
      confirmText: "Approve",
      onConfirm: async () => {
        setActionLoading(true);
        const result = await promoteToStaff(user.email);
        setActionLoading(false);
        setConfirmModal((prev) => ({ ...prev, open: false }));

        if (result.success) {
          toast({ title: "Approved", description: result.message });
          loadUsers();
        } else {
          toast({ title: "Error", description: result.error, variant: "destructive" });
        }
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            Active
          </Badge>
        );
      case "pending_verification":
        return (
          <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">
            Pending
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
            Suspended
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-gray-500/20 text-gray-600 border-gray-500/30">
            Banned
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30">
            Admin
          </Badge>
        );
      case "owner":
        return (
          <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
            Owner
          </Badge>
        );
      case "affiliate":
        return (
          <Badge className="bg-pink-500/20 text-pink-600 border-pink-500/30">
            Affiliate
          </Badge>
        );
      case "renter":
        return (
          <Badge className="bg-teal-500/20 text-teal-600 border-teal-500/30">
            Renter
          </Badge>
        );
      case "staff":
        return (
          <Badge className="bg-indigo-500/20 text-indigo-600 border-indigo-500/30">
            Staff
          </Badge>
        );
      case "staff_pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 animate-pulse">
            Staff Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
        <Button className="bg-primary text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedUserIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-primary">
              {selectedUserIds.length} Selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUserIds([])}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReminderOpen(true)}
              disabled={actionLoading}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkSuspend()}
              disabled={actionLoading || !isSuperAdmin}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkReactivate()}
              disabled={actionLoading || !isSuperAdmin}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Reactivate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkDelete()}
              disabled={actionLoading || !isSuperAdmin}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="renter">Renter</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="affiliate">Affiliate</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending_verification">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Complete list of registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUserIds.length === filteredUsers.length
                    }
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleSelectUser(user.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.fullName}</p>
                          {user.isReferred && (
                            <Badge
                              variant="outline"
                              className="h-5 py-0 px-2 bg-pink-50 text-pink-600 border-pink-100 uppercase text-[10px] font-bold"
                            >
                              Referred
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.accountStatus)}</TableCell>
                  <TableCell>
                    {user.role === "owner" ? (
                      <Badge
                        variant={
                          user.verificationStatus === "verified"
                            ? "default"
                            : user.verificationStatus === "submitted"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {user.verificationStatus || "pending"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">
                        Not Required
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLoginAt?.toLocaleDateString() || "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            (window.location.href = `/admin/users/${user.id}`)
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUserIds([user.id]);
                            setReminderOpen(true);
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.accountStatus === "suspended" ? (
                          <DropdownMenuItem
                            className="text-green-600"
                            disabled={!isSuperAdmin}
                            onClick={() => {
                              setSelectedUserIds([user.id]);
                              handleBulkReactivate([user.id]);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Reactivate Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-destructive"
                            disabled={!isSuperAdmin}
                            onClick={() => {
                              setSelectedUserIds([user.id]);
                              handleBulkSuspend([user.id]);
                            }}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={
                            user.isAdmin ? "text-orange-600" : "text-purple-600"
                          }
                          onClick={() => handleToggleAdmin(user)}
                        >
                          {user.isAdmin ? (
                            <>
                              <ShieldOff className="h-4 w-4 mr-2" /> Revoke
                              Admin
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" /> Promote to
                              Admin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            user.isStaff ? "text-orange-600" : "text-blue-600"
                          }
                          onClick={() => handleToggleStaff(user)}
                        >
                          {user.isStaff ? (
                            <>
                              <ShieldOff className="h-4 w-4 mr-2" /> Revoke
                              Staff
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" /> Promote to
                              Staff
                            </>
                          )}
                        </DropdownMenuItem>

                        {user.role === "staff_pending" && (
                          <DropdownMenuItem
                            className="text-green-600 font-bold"
                            onClick={() => handleApproveStaff(user)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" /> Approve Staff Request
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        {isSuperAdmin && (
                          <DropdownMenuItem
                            className={
                              user.isSuperAdmin ? "text-orange-600" : "text-red-600 font-bold"
                            }
                            onClick={() => handleToggleSuperAdmin(user)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            {user.isSuperAdmin ? "Revoke Super Admin" : "Promote to Super Admin"}
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          disabled={!isSuperAdmin}
                          onClick={() => {
                            // Bug Fix: pass ID directly to avoid reliance on selection state for single action
                            handleBulkDelete([user.id]);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl">
                    {selectedUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.fullName}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.accountStatus)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">
                    Verification Status
                  </p>
                  <p className="font-medium capitalize">
                    {selectedUser.role === "owner"
                      ? selectedUser.verificationStatus || "pending"
                      : "Not Required"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {selectedUser.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">
                    {selectedUser.lastLoginAt?.toLocaleDateString() || "Never"}
                  </p>
                </div>
                {selectedUser.isReferred && (
                  <div className="p-4 rounded-lg bg-pink-500/5 border border-pink-500/20 col-span-2">
                    <p className="text-sm text-pink-600 font-semibold mb-1 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Referred Account
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This user joined via a referral.
                    </p>
                    {selectedUser.referredBy && (
                      <p className="mt-1 font-medium">
                        Referred by: {selectedUser.referredBy}
                      </p>
                    )}
                  </div>
                )}
                {selectedUser.role === "affiliate" && (
                  <>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">
                        Affiliate Code
                      </p>
                      <p className="font-medium font-mono">
                        {selectedUser.affiliateCode}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground">
                        Total Referrals
                      </p>
                      <p className="font-medium">
                        {selectedUser.totalReferrals}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50 col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Total Earnings
                      </p>
                      <p className="font-medium text-lg">
                        KSh {selectedUser.totalEarnings.toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
                {(selectedUser.role === "owner" ||
                  selectedUser.role === "affiliate") &&
                  selectedUser.verificationDeadline && (
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 col-span-2">
                      <p className="text-sm text-orange-600">
                        Verification Deadline
                      </p>
                      <p className="font-medium">
                        {selectedUser.verificationDeadline.toLocaleDateString()}
                      </p>
                    </div>
                  )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedUserIds([selectedUser.id]);
                    setReminderOpen(true);
                  }}
                >
                  Send Email
                </Button>
                {selectedUser.accountStatus === "suspended" ? (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setSelectedUser(null);
                      setSelectedUserIds([selectedUser.id]);
                      handleBulkReactivate();
                    }}
                  >
                    Reactivate Account
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedUser(null);
                      setSelectedUserIds([selectedUser.id]);
                      handleBulkSuspend();
                    }}
                  >
                    Suspend Account
                  </Button>
                )}
                {selectedUser.isAdmin ? (
                  <Button
                    variant="outline"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={() => {
                      handleToggleAdmin(selectedUser);
                      setSelectedUser(null);
                    }}
                  >
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Revoke Admin
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => {
                      handleToggleAdmin(selectedUser);
                      setSelectedUser(null);
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Promote to Admin
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reminder Email Dialog */}
      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Reminder</DialogTitle>
            <DialogDescription>
              Send an email and notification to {selectedUserIds.length} users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="e.g. Action Required: Verification"
                value={reminderSubject}
                onChange={(e) => setReminderSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Enter your message here..."
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReminder} disabled={actionLoading}>
              {actionLoading ? "Sending..." : "Send Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ActionConfirmModal
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal((prev) => ({ ...prev, open }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
        confirmText={confirmModal.confirmText}
        loading={actionLoading}
      />
    </div >
  );
}
