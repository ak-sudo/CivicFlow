"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Shield, Database, Mail } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { useState } from "react"

export default function SettingsPage() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoAssign: true,
    aiProcessing: true,
    publicReports: true,
  })

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="ml-64">
        <AdminTopNav userName="सुनीता मेहता / Sunita Mehta" />

        <main className="p-6 overflow-y-auto">
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold">{t("admin.settings")}</h1>
              <p className="text-muted-foreground mt-1">Manage system preferences and configurations</p>
            </div>

            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic system configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" defaultValue="Municipal Corporation of Delhi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue="admin@civicflow.delhi.gov.in" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" type="tel" defaultValue="+91-11-2345-6789" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>Advanced system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Assign Reports</Label>
                    <p className="text-sm text-muted-foreground">Automatically assign reports to workers</p>
                  </div>
                  <Switch
                    checked={settings.autoAssign}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoAssign: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI Processing</Label>
                    <p className="text-sm text-muted-foreground">Enable AI-powered report analysis</p>
                  </div>
                  <Switch
                    checked={settings.aiProcessing}
                    onCheckedChange={(checked) => setSettings({ ...settings, aiProcessing: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Report View</Label>
                    <p className="text-sm text-muted-foreground">Allow public to view reports</p>
                  </div>
                  <Switch
                    checked={settings.publicReports}
                    onCheckedChange={(checked) => setSettings({ ...settings, publicReports: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Login Attempts</Label>
                  <Input type="number" defaultValue="5" />
                </div>
                <Button variant="outline">Reset All User Passwords</Button>
              </CardContent>
            </Card>

            {/* Email Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Templates
                </CardTitle>
                <CardDescription>Customize automated email messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Edit Welcome Email
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Edit Report Confirmation Email
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Edit Worker Assignment Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
