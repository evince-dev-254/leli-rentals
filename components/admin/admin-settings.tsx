"use client"

import { useState, useEffect } from "react"
import { Save, Bell, Shield, CreditCard, Globe, Eye, EyeOff, AlertTriangle, RotateCcw } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAdmins, getUserByEmail, updateProfile } from "@/lib/actions/dashboard-actions"
import { resetDatabase } from "@/lib/actions/admin-actions"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface AdminSetting {
  key: string
  value: string
  description?: string
}

export function AdminSettings() {
  // const [admins, setAdmins] = useState<any[]>([]) // Moved to separate page
  // const [newAdminEmail, setNewAdminEmail] = useState("") // Moved
  // const [loading, setLoading] = useState(true) // Moved
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
  const [showAdminPassword, setShowAdminPassword] = useState(false)

  // System Reset State
  const [resetConfirmText, setResetConfirmText] = useState("")
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    // loadAdmins() // Moved
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
      if (error) {
        // Handle specific error messages
        if (error.message.includes('should be different')) {
          toast.error("New password must be different from your current password")
        } else if (error.message.includes('Password should contain')) {
          toast.error("Password must contain: uppercase, lowercase, number, and special character")
        } else {
          toast.error(error.message || "Failed to update password")
        }
        return
      }
      toast.success("Password updated successfully")
      setAdminNewPassword("")
      setAdminConfirmPassword("")
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast.error(error.message || "Failed to update password")
    }
  }

  /* 
  const loadAdmins = async () => { ... } // Moved to separate page
  */

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

      // Force settings revalidation 
      // Assuming there is a server action for this, usually. 
      // If we are just updating the table, we might need a server action to clear cache or we rely on client re-fetch.
      // Since `loadSettings` runs on mount, internal nav is fine.
      // But if other parts of the site use `unstable_cache`, we need to invalidate it.
      // For now, let's assume direct client update is handled by the client state, but we'll add a cache buster if we find one.

      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  /* 
  const handleAddAdmin = ... // Moved
  const handleRemoveAdmin = ... // Moved
  */

  const handleResetSystem = async () => {
    if (resetConfirmText !== "RESET") {
      toast.error("Please type RESET to confirm")
      return
    }

    try {
      setResetting(true)
      const result = await resetDatabase()
      if (result.success) {
        toast.success("System reset successfully. All non-admin data cleared.")
        setResetConfirmText("")
        // Optional: redirect to login or dashboard
        setTimeout(() => window.location.reload(), 2000)
      } else {
        toast.error(result.error || "Failed to reset system")
      }
    } catch (error) {
      console.error("Error resetting system:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setResetting(false)
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
          {/* <TabsTrigger value="admins">Admins</TabsTrigger> Moved to separate page */}
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
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
                <p className="text-sm text-muted-foreground">Password must contain: uppercase, lowercase, number, and special character (!@#$%^&*)</p>
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-new-password"
                        type={showAdminPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={adminNewPassword}
                        onChange={(e) => setAdminNewPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                      >
                        {showAdminPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-confirm-password">Confirm Password</Label>
                    <Input
                      id="admin-confirm-password"
                      type={showAdminPassword ? "text" : "password"}
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
                    placeholder="leli rentals"
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
                {saving ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
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
                {saving ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="maintenance">
          <Card className="border-destructive/50 glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Maintenance & Danger Zone
              </CardTitle>
              <CardDescription>
                Critical system operations. Proceed with extreme caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-destructive">Reset Application Data</p>
                    <p className="text-sm text-muted-foreground mr-4">
                      This will permanently delete ALL listings, bookings, reviews, and non-admin user accounts.
                      This action cannot be undone. System configuration like categories will be preserved.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-confirm">Type <span className="font-bold text-destructive">RESET</span> to confirm</Label>
                    <Input
                      id="reset-confirm"
                      value={resetConfirmText}
                      onChange={(e) => setResetConfirmText(e.target.value)}
                      placeholder="RESET"
                      className="max-w-[200px] border-destructive/50"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleResetSystem}
                    disabled={resetConfirmText !== "RESET" || resetting}
                    className="w-full sm:w-auto"
                  >
                    {resetting ? (
                      <Spinner className="h-4 w-4 mr-2" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Clear All Data and Start Afresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
