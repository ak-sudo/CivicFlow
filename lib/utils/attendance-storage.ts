export interface AttendanceRecord {
  id: string
  worker_id: string
  worker_name: string
  check_in_time: string
  check_out_time: string | null
  duration_minutes: number | null
  date: string
  location?: {
    latitude: number
    longitude: number
    locationName?: string
  }
  status: "checked_in" | "checked_out"
  created_at: string
  updated_at: string
}

const ATTENDANCE_KEY = "civicflow_attendance_records"

export function getAttendanceRecords(): AttendanceRecord[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(ATTENDANCE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveAttendanceRecord(record: AttendanceRecord): void {
  if (typeof window === "undefined") return
  try {
    const records = getAttendanceRecords()
    const existingIndex = records.findIndex((r) => r.id === record.id)

    if (existingIndex >= 0) {
      records[existingIndex] = record
    } else {
      records.push(record)
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records))
    window.dispatchEvent(new CustomEvent("attendanceUpdated", { detail: { record } }))
  } catch (error) {
    console.error("Failed to save attendance record:", error)
  }
}

export function getTodayAttendance(workerId: string): AttendanceRecord | null {
  const records = getAttendanceRecords()
  const today = new Date().toDateString()

  return records.find((r) => r.worker_id === workerId && new Date(r.date).toDateString() === today) || null
}

export function getWorkerAttendanceHistory(workerId: string, limit?: number): AttendanceRecord[] {
  const records = getAttendanceRecords()
  const workerRecords = records
    .filter((r) => r.worker_id === workerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return limit ? workerRecords.slice(0, limit) : workerRecords
}

export function calculateDuration(checkInTime: string, checkOutTime: string): number {
  const checkIn = new Date(checkInTime)
  const checkOut = new Date(checkOutTime)
  return Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60)) // minutes
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function addAttendanceAuditLog(record: AttendanceRecord): void {
  if (typeof window === "undefined") return

  try {
    const auditLogs = JSON.parse(localStorage.getItem("civicflow_audit_logs") || "[]")

    const auditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action: record.status === "checked_in" ? "WORKER_CHECK_IN" : "WORKER_CHECK_OUT",
      user_id: record.worker_id,
      user_name: record.worker_name,
      user_role: "worker",
      details: {
        attendance_id: record.id,
        check_in_time: record.check_in_time,
        check_out_time: record.check_out_time,
        duration_minutes: record.duration_minutes,
        date: record.date,
      },
      ip_address: "127.0.0.1",
      user_agent: navigator.userAgent,
    }

    auditLogs.unshift(auditEntry)

    // Keep only last 500 logs
    if (auditLogs.length > 500) {
      auditLogs.splice(500)
    }

    localStorage.setItem("civicflow_audit_logs", JSON.stringify(auditLogs))
    window.dispatchEvent(new CustomEvent("auditLogUpdated"))
  } catch (error) {
    console.error("Failed to add audit log:", error)
  }
}

export async function getLocationName(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
    )
    const data = await response.json()

    if (data.display_name) {
      return data.display_name
    }

    // Fallback to coordinates if name not available
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  } catch (error) {
    console.error("Failed to get location name:", error)
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  }
}
