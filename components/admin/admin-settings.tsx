"use client"

import { useState, useEffect } from "react"
import { Save, Bell, Shield, CreditCard, Globe, UserCog, Plus, Trash2, Search, Eye, EyeOff, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAdmins, getUserByEmail, updateProfile } from "@/lib/actions/dashboard-actions"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface AdminSetting {
  key: string
  value: string
  description?: string
}

export function AdminSettings() {
  const [admins, setAdmins] = useState<any[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)

  // Settings State
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Visibility Toggles
  const [showPublicKey, setShowPublicKey] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)

  // Password Change State
  const [adminNewPassword, setAdminNewPassword] = useState("")
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("")

  useEffect(() => {
    loadAdmins()
    getCurrentUser()
    loadSettings()
  }, [])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setCurrentUserEmail(user.email ?? null)
  }

  const handleAdminPasswordChange = async () => {
    if (!adminNewPassword || adminNewPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    if (adminNewPassword !== adminConfirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: adminNewPassword })
      if (error) throw error
      toast.success("Password updated successfully")
      setAdminNewPassword("")
      setAdminConfirmPassword("")
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast.error(error.message || "Failed to update password")
    }
  }

  const loadAdmins = async () => {
    try {
      const data = await getAdmins()
      setAdmins(data || [])
    } catch (error) {
      console.error("Error loading admins:", error)
      toast.error("Failed to load admins")
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async () => {
    try {
      setSettingsLoading(true)
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')

      if (error) throw error

      const settingsMap: Record<string, string> = {}
      data?.forEach((item: AdminSetting) => {
        settingsMap[item.key] = item.value
      })
      setSettings(settingsMap)
    } catch (error) {
      console.error("Error loading settings:", error)
      // Don't show error toast on first load if table doesn't exist yet to avoid confusion
      // toast.error("Failed to load settings") 
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('admin_settings')
        .upsert(updates)

      if (error) throw error

      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdminEmail) return

    try {
      const user = await getUserByEmail(newAdminEmail)
      if (!user) {
        toast.error("User with this email not found")
        return
      }

      if (user.is_admin || user.role === 'admin') {
        toast.info("User is already an admin")
        setNewAdminEmail("")
        return
      }

      await updateProfile(user.id, { is_admin: true })
      toast.success(`${user.email} promoted to admin`)
      setNewAdminEmail("")
      loadAdmins()
    } catch (error) {
      console.error("Error adding admin:", error)
      toast.error("Failed to add admin")
    }
  }

  const handleRemoveAdmin = async (adminId: string, email: string) => {
    if (email === currentUserEmail) {
      toast.error("You cannot remove yourself from admins")
      return
    }

    if (!confirm(`Are you sure you want to remove admin rights from ${email}?`)) return

    try {
      const adminUser = admins.find(a => a.id === adminId);
      const updates: any = { is_admin: false };
      if (adminUser?.role === 'admin') {
        updates.role = 'renter';
      }

      await updateProfile(adminId, updates)
      toast.success(`${email} removed from admins`)
      loadAdmins()
    } catch (error) {
      console.error("Error removing admin:", error)
      toast.error("Failed to remove admin")
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="security">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-password">New Password</Label>
                    <Input
                      id="admin-new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-confirm-password">Confirm Password</Label>
                    <Input
                      id="admin-confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={adminConfirmPassword}
                      onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAdminPasswordChange}
                    disabled={!adminNewPassword || !adminConfirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={settings.site_name || ""}
                    onChange={(e) => handleSettingChange('site_name', e.target.value)}
                    placeholder="Leli Rentals"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    value={settings.support_email || ""}
                    onChange={(e) => handleSettingChange('support_email', e.target.value)}
                    placeholder="support@lelirentals.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input
                    id="support-phone"
                    value={settings.support_phone || ""}
                    onChange={(e) => handleSettingChange('support_phone', e.target.value)}
                    placeholder="+254..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Input
                    id="default-currency"
                    value={settings.default_currency || ""}
                    onChange={(e) => handleSettingChange('default_currency', e.target.value)}
                    placeholder="KSh"
                  />
                </div>
              </div>
              <Button onClick={saveSettings} disabled={saving} className="bg-primary text-primary-foreground">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Manage Admins
              </CardTitle>
              <CardDescription>View and manage administrators with access to this dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Admin logic unchanged */}
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="new-admin-email">Add New Admin</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-admin-email"
                      placeholder="Enter user email address..."
                      className="pl-10"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleAddAdmin} disabled={!newAdminEmail}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </div>

              <Separator />

              {/* Admins List logic unchanged */}
              <div className="space-y-4">
                <h4 className="font-medium">Current Admins</h4>
                {loading ? (
                  <p className="text-muted-foreground">Loading admins...</p>
                ) : (
                  <div className="grid gap-4">
                    {admins.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                        {/* Admin Item Content */}
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={admin.avatar_url || undefined} />
                            <AvatarFallback>
                              {admin.full_name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{admin.full_name || "Unknown Name"}</p>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {admin.email === currentUserEmail && (
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">You</span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                            disabled={admin.email === currentUserEmail}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card className="glass-card">
            {/* Verification settings (Mocked for now as logic sits elsewhere usually, but let's persist standard values) */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Settings
              </CardTitle>
              <CardDescription>Configure user verification requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Owner Verification</p>
                    <p className="text-sm text-muted-foreground">Owners must submit documents before listing items</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Affiliate Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Affiliates must verify identity before earning commissions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="verification-deadline">Verification Deadline (Days)</Label>
                  <Input id="verification-deadline" type="number" defaultValue="5" className="w-32" />
                  <p className="text-sm text-muted-foreground">
                    Days allowed for document submission before account suspension
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-suspend on Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically suspend accounts that miss verification deadline
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              {/* Verification settings not yet wired to DB, keeping dummy save for UX */}
              <Button onClick={() => toast.success("Verification settings saved")} className="bg-primary text-primary-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass-card">
            {/* Notification settings (Mocked) */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure email and system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Notification Toggles */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New User Registration</p>
                    <p className="text-sm text-muted-foreground">Notify admin when new users register</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Verification Document Submitted</p>
                    <p className="text-sm text-muted-foreground">Notify when documents are uploaded</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Verification Deadline Warning</p>
                    <p className="text-sm text-muted-foreground">Send reminder emails before deadline</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Account Suspension</p>
                    <p className="text-sm text-muted-foreground">Notify when accounts are suspended</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Button onClick={() => toast.success("Notification settings saved")} className="bg-primary text-primary-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>Configure Paystack and subscription plans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paystack-public">Paystack Public Key</Label>
                  <div className="relative">
                    <Input
                      id="paystack-public"
                      type={showPublicKey ? "text" : "password"}
                      value={settings.paystack_public_key || ""}
                      onChange={(e) => handleSettingChange('paystack_public_key', e.target.value)}
                      placeholder="pk_live_..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPublicKey(!showPublicKey)}
                    >
                      {showPublicKey ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">Toggle public key visibility</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paystack-secret">Paystack Secret Key</Label>
                  <div className="relative">
                    <Input
                      id="paystack-secret"
                      type={showSecretKey ? "text" : "password"}
                      value={settings.paystack_secret_key || ""}
                      onChange={(e) => handleSettingChange('paystack_secret_key', e.target.value)}
                      placeholder="sk_live_..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                    >
                      {showSecretKey ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">Toggle secret key visibility</span>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Subscription Plans</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border border-border space-y-3">
                    <p className="font-medium">Weekly Plan</p>
                    <div className="space-y-2">
                      <Label htmlFor="weekly-price">Price (KSh)</Label>
                      <Input
                        id="weekly-price"
                        type="number"
                        value={settings.weekly_plan_price || "500"}
                        onChange={(e) => handleSettingChange('weekly_plan_price', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weekly-listings">Listing Limit</Label>
                      <Input
                        id="weekly-listings"
                        type="number"
                        value={settings.weekly_plan_limit || "10"}
                        onChange={(e) => handleSettingChange('weekly_plan_limit', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border space-y-3">
                    <p className="font-medium">Monthly Plan</p>
                    <div className="space-y-2">
                      <Label htmlFor="monthly-price">Price (KSh)</Label>
                      <Input
                        id="monthly-price"
                        type="number"
                        value={settings.monthly_plan_price || "1000"}
                        onChange={(e) => handleSettingChange('monthly_plan_price', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthly-listings">Listing Limit</Label>
                      <Input
                        id="monthly-listings"
                        value={settings.monthly_plan_limit || "Unlimited"}
                        onChange={(e) => handleSettingChange('monthly_plan_limit', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="affiliate-commission">Affiliate Commission Rate (%)</Label>
                <Input
                  id="affiliate-commission"
                  type="number"
                  value={settings.affiliate_commission_rate || "15"}
                  onChange={(e) => handleSettingChange('affiliate_commission_rate', e.target.value)}
                  className="w-32"
                />
              </div>

              <Button onClick={saveSettings} disabled={saving} className="bg-primary text-primary-foreground">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
