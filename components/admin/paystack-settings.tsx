"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Key, Webhook, CheckCircle, XCircle, Copy, Eye, EyeOff } from "lucide-react"

export function PaystackSettings() {
    const [showTestSecret, setShowTestSecret] = useState(false)
    const [showLiveSecret, setShowLiveSecret] = useState(false)
    const [testPublicKey, setTestPublicKey] = useState("")
    const [testSecretKey, setTestSecretKey] = useState("")
    const [livePublicKey, setLivePublicKey] = useState("")
    const [liveSecretKey, setLiveSecretKey] = useState("")

    useEffect(() => {
        // Load current keys from environment (read-only display)
        setTestPublicKey(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "")
    }, [])

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        alert(`${label} copied to clipboard!`)
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="test" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="test">Test Mode</TabsTrigger>
                    <TabsTrigger value="live">Live Mode</TabsTrigger>
                </TabsList>

                <TabsContent value="test" className="space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                                    <Key className="h-5 w-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Test API Keys</h3>
                                    <p className="text-sm text-muted-foreground">For development and testing</p>
                                </div>
                            </div>
                            <Badge variant="secondary">Test Mode</Badge>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="test-public">Public Key</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <Input
                                        id="test-public"
                                        value={testPublicKey}
                                        onChange={(e) => setTestPublicKey(e.target.value)}
                                        placeholder="pk_test_..."
                                        className="font-mono text-sm"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(testPublicKey, "Test Public Key")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="test-secret">Secret Key</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <Input
                                        id="test-secret"
                                        type={showTestSecret ? "text" : "password"}
                                        value={testSecretKey}
                                        onChange={(e) => setTestSecretKey(e.target.value)}
                                        placeholder="sk_test_..."
                                        className="font-mono text-sm"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowTestSecret(!showTestSecret)}
                                    >
                                        {showTestSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(testSecretKey, "Test Secret Key")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm">
                                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📝 How to update:</p>
                                <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                                    <li>Copy your keys from Paystack Dashboard</li>
                                    <li>Add them to your <code className="bg-background px-1 py-0.5 rounded">.env.local</code> file</li>
                                    <li>Restart your development server</li>
                                </ol>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                                <Webhook className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Test Webhook Configuration</h3>
                                <p className="text-sm text-muted-foreground">Configure in Paystack Dashboard</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <Label>Webhook URL</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <Input
                                        value="http://localhost:3000/api/webhooks/paystack"
                                        readOnly
                                        className="font-mono text-sm bg-muted"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard("http://localhost:3000/api/webhooks/paystack", "Webhook URL")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    For local testing, use ngrok or similar tunneling service
                                </p>
                            </div>

                            <div>
                                <Label>Callback URL</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <Input
                                        value="http://localhost:3000/payment/success"
                                        readOnly
                                        className="font-mono text-sm bg-muted"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard("http://localhost:3000/payment/success", "Callback URL")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="live" className="space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                    <Key className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Live API Keys</h3>
                                    <p className="text-sm text-muted-foreground">For production use</p>
                                </div>
                            </div>
                            <Badge className="bg-green-500">Live Mode</Badge>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="live-public">Public Key</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <Input
                                        id="live-public"
                                        value={livePublicKey}
                                        onChange={(e) => setLivePublicKey(e.target.value)}
                                        placeholder="pk_live_..."
                                        className="font-mono text-sm"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(livePublicKey, "Live Public Key")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="live-secret">Secret Key</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <Input
                                        id="live-secret"
                                        type={showLiveSecret ? "text" : "password"}
                                        value={liveSecretKey}
                                        onChange={(e) => setLiveSecretKey(e.target.value)}
                                        placeholder="sk_live_..."
                                        className="font-mono text-sm"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowLiveSecret(!showLiveSecret)}
                                    >
                                        {showLiveSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(liveSecretKey, "Live Secret Key")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm">
                                <p className="font-semibold text-red-600 dark:text-red-400 mb-2">⚠️ Production Keys:</p>
                                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                                    <li>Never commit live keys to version control</li>
                                    <li>Store in environment variables on your hosting platform</li>
                                    <li>Rotate keys immediately if compromised</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                                <Webhook className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Live Webhook Configuration</h3>
                                <p className="text-sm text-muted-foreground">Production webhook endpoints</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <Label>Webhook URL</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <Input
                                        value="https://leli.rentals/api/webhooks/paystack"
                                        readOnly
                                        className="font-mono text-sm bg-muted"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard("https://leli.rentals/api/webhooks/paystack", "Live Webhook URL")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label>Callback URL</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <Input
                                        value="https://leli.rentals/payment/success"
                                        readOnly
                                        className="font-mono text-sm bg-muted"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard("https://leli.rentals/payment/success", "Live Callback URL")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Environment Variables</h3>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs space-y-2">
                    <p className="text-muted-foreground"># Add to .env.local (development)</p>
                    <p>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here</p>
                    <p>PAYSTACK_SECRET_KEY=sk_test_your_key_here</p>
                    <p className="text-muted-foreground mt-4"># Add to production environment</p>
                    <p>NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_key_here</p>
                    <p>PAYSTACK_SECRET_KEY=sk_live_your_key_here</p>
                    <p>SUPABASE_SERVICE_ROLE_KEY=your_service_role_key</p>
                </div>
            </Card>
        </div>
    )
}
