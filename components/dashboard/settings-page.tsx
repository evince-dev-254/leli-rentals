"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { updateProfile } from "@/lib/actions/dashboard-actions"
import { updatePaymentInfo } from "@/lib/actions/affiliate-actions"
import { detectKenyanProvider } from "@/lib/utils/phone-utils"
import { toast } from "sonner"
import { User, Bell, Save, CreditCard, Plus, AlertCircle, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { LoadingLogo } from "@/components/ui/loading-logo"
import { LocationSearch } from "@/components/ui/location-search"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsPage() {
  const router = useRouter()
  // const { toast } = useToast() // Assuming you have a toast component, if not, use alert or console
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  })

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Payment Settings State
  const [paymentProvider, setPaymentProvider] = useState("mpesa")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [savingPayment, setSavingPayment] = useState(false)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user) // Store user in state
          const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single()


          // Use profile data or fallback to auth metadata
          const meta = user.user_metadata || {}

          setProfile(data || {})
          setFormData({
            full_name: data?.full_name || meta.full_name || meta.name || "",
            email: data?.email || user.email || "",
            phone: data?.phone || user.phone || meta.phone || "",
            location: data?.location || "",
            bio: data?.bio || ""
          })

          if (data?.payment_info) {
            setPaymentProvider(data.payment_info.provider || "mpesa")
            setAccountNumber(data.payment_info.account_number || "")
            setAccountName(data.payment_info.account_name || "")
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }
    getProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[DEBUG] handleSave started")
    setSaving(true)
    try {
      if (!user) {
        console.error("[DEBUG] No user found in handleSave")
        toast.error("Session expired. Please refresh the page.")
        return
      }
      console.log("[DEBUG] User ID:", user.id)

      const updates = {
        id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
      }

      const result = await updateProfile(updates)
      console.log("[DEBUG] updateProfile result:", result)

      if (result.success) {
        toast.success("Profile updated successfully!")
        setProfile((prev: any) => ({ ...prev, ...updates }))
      } else {
        console.error("[DEBUG] updateProfile failed:", result.error)
        toast.error("Failed to update profile", {
          description: result.error
        })
      }
    } catch (e: any) {
      console.error("[DEBUG] Error in handleSave:", e)
      toast.error("An error occurred", {
        description: e.message
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAccountChange = (val: string) => {
    setAccountNumber(val)
    const detected = detectKenyanProvider(val)
    if (detected) {
      setPaymentProvider(detected)
    }
  }

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[DEBUG] handleSavePayment started")
    setSavingPayment(true)
    try {
      if (!user) {
        console.error("[DEBUG] No user found in handleSavePayment")
        toast.error("Session expired. Please refresh the page.")
        return
      }
      console.log("[DEBUG] User ID:", user.id)

      const paymentInfo = {
        type: 'mobile_money',
        provider: paymentProvider,
        account_number: accountNumber,
        account_name: accountName
      }
      console.log("[DEBUG] Payment Info:", paymentInfo)

      const result = await updatePaymentInfo(user.id, paymentInfo)
      console.log("[DEBUG] updatePaymentInfo result:", result)

      if (result.success) {
        toast.success("Payment details saved!")
        setProfile((prev: any) => ({ ...prev, payment_info: paymentInfo }))
      } else {
        console.error("[DEBUG] updatePaymentInfo failed:", result.error)
        toast.error("Failed to save payment info", {
          description: result.error
        })
      }
    } catch (e: any) {
      console.error("[DEBUG] Error in handleSavePayment:", e)
      toast.error("An error occurred", {
        description: e.message
      })
    } finally {
      setSavingPayment(false)
    }
  }

  if (loading) return <div className="flex justify-center p-20"><LoadingLogo size={60} /></div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Type Selection */}
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Account Type</h3>
                    <p className="text-sm text-muted-foreground">
                      Current: <span className="text-primary font-medium capitalize">{profile?.role || 'Renter'}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-background"
                    onClick={() => router.push('/select-role?force=true')}
                  >
                    Switch Account Type
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Change your account type to access different features. Owners need an active subscription.
                </p>
              </div>
              <Separator />

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="max-w-xs">
                    <ImageUpload
                      folder="/avatars"
                      onSuccess={async (res) => {
                        try {
                          const { data: { user } } = await supabase.auth.getUser()
                          if (user) {
                            await updateProfile(user.id, { avatar_url: res.url })
                            setProfile((prev: any) => ({ ...(prev || {}), avatar_url: res.url }))
                            toast.success("Profile photo updated!")
                          }
                        } catch (e: any) {
                          console.error("Error updating avatar", e)
                          toast.error("Failed to update avatar", {
                            description: e.message
                          })
                        }
                      }}
                      onError={(err) => console.error(err)}
                      buttonText="Change Photo"
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">JPG, PNG. Max 10MB</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input name="full_name" value={formData.full_name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" value={formData.email} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +254 712 345 678" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <LocationSearch
                    onLocationSelect={(data) => setFormData(prev => ({ ...prev, location: data.address }))}
                    defaultValue={formData.location}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell renters about yourself..."
                />
              </div>

              <Button
                className="bg-primary text-primary-foreground"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive emails about your bookings and account activity.</p>
                </div>
                <Switch checked={true} onCheckedChange={() => { }} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive text messages for urgent updates.</p>
                </div>
                <Switch checked={false} onCheckedChange={() => { }} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive news and special offers from leli rentals.</p>
                </div>
                <Switch checked={true} onCheckedChange={() => { }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Password must contain: uppercase, lowercase, number, and special character (!@#$%^&*)</p>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!newPassword || newPassword.length < 6) {
                        toast.error("Invalid Password", {
                          description: "Password must be at least 6 characters"
                        })
                        return
                      }
                      if (newPassword !== confirmPassword) {
                        toast.error("Passwords mismatch", {
                          description: "The confirmation password does not match."
                        })
                        return
                      }

                      try {
                        const { error } = await supabase.auth.updateUser({ password: newPassword })
                        if (error) {
                          // Handle specific error messages
                          if (error.message.includes('should be different')) {
                            toast.error("Update Failed", {
                              description: "New password must be different from your current password"
                            })
                          } else if (error.message.includes('Password should contain')) {
                            toast.error("Weak Password", {
                              description: "Password must contain: uppercase, lowercase, number, and special character"
                            })
                          } else {
                            toast.error("Update Failed", {
                              description: error.message || "Failed to update password"
                            })
                          }
                          return
                        }
                        toast.success("Password updated successfully")
                        setNewPassword("")
                        setConfirmPassword("")
                      } catch (error: any) {
                        console.error("Error updating password:", error)
                        toast.error("Unexpected Error", {
                          description: error.message || "Failed to update password"
                        })
                      }
                    }}
                    disabled={!newPassword || !confirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Recent Activity</h3>
                <div className="rounded-md border border-border">
                  <div className="p-4 flex items-center justify-between border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">Login from Chrome on Linux</p>
                      <p className="text-xs text-muted-foreground">Nairobi, Kenya • Just now</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 bg-green-500/10 border-green-200">Current Session</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payout Details
              </CardTitle>
              <CardDescription>Manage where you receive your earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSavePayment} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Payment Provider</Label>
                  <Select value={paymentProvider} onValueChange={setPaymentProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpesa">M-Pesa (Mobile Money)</SelectItem>
                      <SelectItem value="airtel">Airtel Money</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account Number / Phone</Label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => handleAccountChange(e.target.value)}
                    placeholder={paymentProvider === 'mpesa' ? "e.g. 0712345678" : paymentProvider === 'airtel' ? "e.g. 0733..." : "Bank Account Number"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Full Name as on Account"
                    required
                  />
                </div>
                <Button type="submit" disabled={savingPayment}>
                  {savingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Details
                </Button>
              </form>

              <div className="bg-blue-500/10 p-4 rounded-lg flex gap-3 text-sm text-blue-600">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>Ensure your details are correct. Incorrect information may lead to failed or lost payouts.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
