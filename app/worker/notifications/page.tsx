"use client"

import { useState, useEffect } from "react"
import { WorkerNavHeader } from "@/components/worker/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, AlertCircle, Info, X, ExternalLink } from "lucide-react"
import {
  getWorkerNotifications,
  markWorkerNotificationAsRead,
  deleteWorkerNotification,
  markAllWorkerNotificationsAsRead,
  type WorkerNotification,
} from "@/lib/utils/worker-notifications-storage"
import { getProfileFromStorage } from "@/lib/utils/profile-storage"
import Link from "next/link"

export default function WorkerNotificationsPage() {
  const [notifications, setNotifications] = useState<WorkerNotification[]>([])
  const profile = getProfileFromStorage()
  const workerId = profile?.id || "worker_default"
  const userName = profile?.full_name || "Worker"

  useEffect(() => {
    loadNotifications()

    const handleNotificationUpdate = () => loadNotifications()
    window.addEventListener("workerNotificationAdded", handleNotificationUpdate)
    window.addEventListener("workerNotificationUpdated", handleNotificationUpdate)

    return () => {
      window.removeEventListener("workerNotificationAdded", handleNotificationUpdate)
      window.removeEventListener("workerNotificationUpdated", handleNotificationUpdate)
    }
  }, [workerId])

  const loadNotifications = () => {
    const realNotifications = getWorkerNotifications(workerId)
    setNotifications(realNotifications)
  }

  const handleMarkAsRead = (id: string) => {
    markWorkerNotificationAsRead(id)
    loadNotifications()
  }

  const handleDelete = (id: string) => {
    deleteWorkerNotification(id)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    markAllWorkerNotificationsAsRead(workerId)
    loadNotifications()
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "task_approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "task_rejected":
      case "high_priority":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "task_assigned":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkerNavHeader userName={userName} unreadCount={unreadCount} />

      <main className="container px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">सूचनाएं / Notifications</h1>
              <p className="text-muted-foreground mt-1">{unreadCount} unread notifications</p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                सभी को पढ़ा हुआ चिह्नित करें
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                सभी सूचनाएं / All Notifications
              </CardTitle>
              <CardDescription>Stay updated with your tasks and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">कोई सूचना नहीं / No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive notifications when tasks are assigned to you
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        notification.is_read ? "bg-background" : "bg-muted/50 border-primary/20"
                      }`}
                    >
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <p className="text-xs text-muted-foreground">
                                {new Date(notification.created_at).toLocaleString("hi-IN")}
                              </p>
                              {notification.report_id && (
                                <Link
                                  href={`/worker/tasks`}
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  View Task <ExternalLink className="h-3 w-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
                              <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                                Mark read
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(notification.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
