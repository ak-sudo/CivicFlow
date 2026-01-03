export interface WorkerNotification {
  id: string
  worker_id: string
  type: "task_assigned" | "task_approved" | "task_rejected" | "high_priority" | "info"
  title: string
  message: string
  report_id?: string
  is_read: boolean
  created_at: string
}

const WORKER_NOTIFICATIONS_KEY = "civicflow_worker_notifications"

export function getWorkerNotifications(workerId: string): WorkerNotification[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(WORKER_NOTIFICATIONS_KEY)
    const allNotifications: WorkerNotification[] = stored ? JSON.parse(stored) : []
    return allNotifications
      .filter((n) => n.worker_id === workerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch {
    return []
  }
}

export function addWorkerNotification(notification: WorkerNotification): void {
  if (typeof window === "undefined") return
  try {
    const stored = localStorage.getItem(WORKER_NOTIFICATIONS_KEY)
    const notifications: WorkerNotification[] = stored ? JSON.parse(stored) : []

    notifications.unshift(notification)

    // Keep only last 100 notifications per worker
    const workerNotifications = notifications.filter((n) => n.worker_id === notification.worker_id)
    if (workerNotifications.length > 100) {
      const toRemove = workerNotifications.slice(100).map((n) => n.id)
      const filtered = notifications.filter((n) => !toRemove.includes(n.id))
      localStorage.setItem(WORKER_NOTIFICATIONS_KEY, JSON.stringify(filtered))
    } else {
      localStorage.setItem(WORKER_NOTIFICATIONS_KEY, JSON.stringify(notifications))
    }

    window.dispatchEvent(new CustomEvent("workerNotificationAdded", { detail: notification }))
  } catch (error) {
    console.error("Failed to add worker notification:", error)
  }
}

export function markWorkerNotificationAsRead(notificationId: string): void {
  if (typeof window === "undefined") return
  try {
    const stored = localStorage.getItem(WORKER_NOTIFICATIONS_KEY)
    const notifications: WorkerNotification[] = stored ? JSON.parse(stored) : []

    const updated = notifications.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))

    localStorage.setItem(WORKER_NOTIFICATIONS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent("workerNotificationUpdated"))
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
  }
}

export function deleteWorkerNotification(notificationId: string): void {
  if (typeof window === "undefined") return
  try {
    const stored = localStorage.getItem(WORKER_NOTIFICATIONS_KEY)
    const notifications: WorkerNotification[] = stored ? JSON.parse(stored) : []

    const filtered = notifications.filter((n) => n.id !== notificationId)

    localStorage.setItem(WORKER_NOTIFICATIONS_KEY, JSON.stringify(filtered))
    window.dispatchEvent(new CustomEvent("workerNotificationUpdated"))
  } catch (error) {
    console.error("Failed to delete notification:", error)
  }
}

export function markAllWorkerNotificationsAsRead(workerId: string): void {
  if (typeof window === "undefined") return
  try {
    const stored = localStorage.getItem(WORKER_NOTIFICATIONS_KEY)
    const notifications: WorkerNotification[] = stored ? JSON.parse(stored) : []

    const updated = notifications.map((n) => (n.worker_id === workerId ? { ...n, is_read: true } : n))

    localStorage.setItem(WORKER_NOTIFICATIONS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent("workerNotificationUpdated"))
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error)
  }
}

export function getUnreadWorkerNotificationCount(workerId: string): number {
  const notifications = getWorkerNotifications(workerId)
  return notifications.filter((n) => !n.is_read).length
}

// Helper function to create notification when report is assigned to worker
export function createTaskAssignedNotification(
  workerId: string,
  reportId: string,
  reportTitle: string,
  location: string,
): void {
  const notification: WorkerNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    worker_id: workerId,
    type: "task_assigned",
    title: "नया कार्य सौंपा गया / New Task Assigned",
    message: `आपको ${location} पर एक नया ${reportTitle} कार्य सौंपा गया है`,
    report_id: reportId,
    is_read: false,
    created_at: new Date().toISOString(),
  }
  addWorkerNotification(notification)
}
