"use client"

import { useState, useEffect } from "react"
import { NavHeader } from "@/components/citizen/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff } from "lucide-react"
import { getReportsFromStorage } from "@/lib/utils/reports-storage"
import { getProfileFromStorage, initializeDefaultProfile } from "@/lib/utils/profile-storage"
import Link from "next/link"

interface Notification {
  id: string
  report_id: string
  title: string
  message: string
  created_at: string
  status: string
  is_read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const profile = getProfileFromStorage() || initializeDefaultProfile()

  useEffect(() => {
    const reports = getReportsFromStorage()

    // Generate notifications from report status changes
    const notifs: Notification[] = []

    reports.forEach((report) => {
      if (report.timeline && report.timeline.length > 1) {
        // Create notification for each status change
        report.timeline.slice(0, 5).forEach((entry) => {
          if (entry.action.includes("Status changed")) {
            notifs.push({
              id: entry.id,
              report_id: report.id,
              title: "Report Status Updated",
              message: `Your report "${report.complaint_text.substring(0, 50)}..." ${entry.action.toLowerCase()}`,
              created_at: entry.created_at,
              status: report.status,
              is_read: false,
            })
          }
        })
      }
    })

    setNotifications(notifs)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <NavHeader userName={profile.full_name} unreadCount={notifications.length} />

      <main className="container px-4 md:px-6 py-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Notifications / सूचनाएं</CardTitle>
            <CardDescription>Stay updated on your report status / अपनी रिपोर्ट की स्थिति पर अपडेट रहें</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No notifications / कोई सूचना नहीं</h3>
                <p className="text-sm text-muted-foreground">You're all caught up! / आप पूरी तरह से अपडेट हैं!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={`/citizen/reports/${notif.report_id}`}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium">{notif.title}</p>
                        <Badge variant="secondary" className="flex-shrink-0">
                          {notif.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
