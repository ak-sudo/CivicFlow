"use client"

import { useState, useEffect } from "react"
import { WorkerNavHeader } from "@/components/worker/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, Loader2, Calendar, MapPin } from "lucide-react"
import {
  saveAttendanceRecord,
  getTodayAttendance,
  getWorkerAttendanceHistory,
  calculateDuration,
  formatDuration,
  addAttendanceAuditLog,
  getLocationName,
  type AttendanceRecord,
} from "@/lib/utils/attendance-storage"
import { getProfileFromStorage } from "@/lib/utils/profile-storage"

export default function AttendancePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const profile = getProfileFromStorage()
  const workerId = profile?.id || "worker_default"
  const workerName = profile?.full_name || "Worker"

  useEffect(() => {
    loadAttendanceData()

    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const handleAttendanceUpdate = () => loadAttendanceData()
    window.addEventListener("attendanceUpdated", handleAttendanceUpdate)

    return () => {
      clearInterval(timer)
      window.removeEventListener("attendanceUpdated", handleAttendanceUpdate)
    }
  }, [])

  const loadAttendanceData = () => {
    const today = getTodayAttendance(workerId)
    const history = getWorkerAttendanceHistory(workerId, 10)

    setTodayAttendance(today)
    setAttendanceHistory(history)
  }

  const handleCheckIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let location: { latitude: number; longitude: number; locationName?: string } | undefined

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true,
            })
          })

          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          // Get location name from coordinates
          const locationName = await getLocationName(latitude, longitude)

          location = {
            latitude,
            longitude,
            locationName,
          }
        } catch (err) {
          console.log("[v0] Geolocation not available or denied")
        }
      }

      const now = new Date()
      const attendanceRecord: AttendanceRecord = {
        id: `attendance_${workerId}_${Date.now()}`,
        worker_id: workerId,
        worker_name: workerName,
        check_in_time: now.toISOString(),
        check_out_time: null,
        duration_minutes: null,
        date: now.toISOString(),
        location,
        status: "checked_in",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      }

      saveAttendanceRecord(attendanceRecord)
      addAttendanceAuditLog(attendanceRecord)
      setTodayAttendance(attendanceRecord)
    } catch (err: any) {
      setError("उपस्थिति दर्ज करने में विफल / Failed to check in")
      console.error("[v0] Check-in error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!todayAttendance) return

    setIsLoading(true)
    setError(null)

    try {
      const now = new Date()
      const duration = calculateDuration(todayAttendance.check_in_time, now.toISOString())

      const updatedRecord: AttendanceRecord = {
        ...todayAttendance,
        check_out_time: now.toISOString(),
        duration_minutes: duration,
        status: "checked_out",
        updated_at: now.toISOString(),
      }

      saveAttendanceRecord(updatedRecord)
      addAttendanceAuditLog(updatedRecord)
      setTodayAttendance(updatedRecord)
    } catch (err: any) {
      setError("चेक आउट करने में विफल / Failed to check out")
      console.error("[v0] Check-out error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getLiveDuration = () => {
    if (!todayAttendance || todayAttendance.check_out_time) return null
    return calculateDuration(todayAttendance.check_in_time, currentTime.toISOString())
  }

  const liveDuration = getLiveDuration()

  return (
    <div className="min-h-screen bg-background">
      <WorkerNavHeader userName={workerName} />

      <main className="container px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">उपस्थिति / Attendance</h1>
            <p className="text-muted-foreground mt-1">Mark your check-in and check-out</p>
          </div>

          {/* Check In/Out Card */}
          <Card>
            <CardHeader>
              <CardTitle>आज की उपस्थिति / Today's Attendance</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {currentTime.toLocaleDateString("hi-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {todayAttendance && todayAttendance.check_in_time && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">चेक इन किया / Checked In</p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {new Date(todayAttendance.check_in_time).toLocaleTimeString("hi-IN")}
                        </p>
                      </div>
                    </div>
                    {todayAttendance.check_out_time && (
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        Completed
                      </Badge>
                    )}
                  </div>

                  {liveDuration !== null && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
                        <div>
                          <p className="font-medium text-blue-900 dark:text-blue-100">Active Session</p>
                          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {formatDuration(liveDuration)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {todayAttendance.check_out_time && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">चेक आउट किया / Checked Out</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(todayAttendance.check_out_time).toLocaleTimeString("hi-IN")}
                          </p>
                        </div>
                      </div>
                      {todayAttendance.duration_minutes && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Duration</p>
                          <p className="text-lg font-bold">{formatDuration(todayAttendance.duration_minutes)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {todayAttendance.location && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Check-in Location</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {todayAttendance.location.locationName ||
                            `${todayAttendance.location.latitude.toFixed(6)}, ${todayAttendance.location.longitude.toFixed(6)}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

              <div className="flex gap-3">
                {!todayAttendance || !todayAttendance.check_in_time ? (
                  <Button onClick={handleCheckIn} disabled={isLoading} className="flex-1" size="lg">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        चेक इन हो रहा है...
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-5 w-5" />
                        चेक इन करें / Check In
                      </>
                    )}
                  </Button>
                ) : !todayAttendance.check_out_time ? (
                  <Button
                    onClick={handleCheckOut}
                    disabled={isLoading}
                    className="flex-1"
                    size="lg"
                    variant="destructive"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        चेक आउट हो रहा है...
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-5 w-5" />
                        चेक आउट करें / Check Out
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex-1 p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 text-center font-medium border border-green-500/20">
                    ✓ आज की उपस्थिति दर्ज / Attendance marked for today
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Location name will be captured automatically when available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>उपस्थिति इतिहास / Attendance History</CardTitle>
              <CardDescription>Your recent check-ins and check-outs</CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">No attendance records yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Check in to start tracking your attendance</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attendanceHistory.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">
                            {new Date(record.date).toLocaleDateString("hi-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            In: {new Date(record.check_in_time).toLocaleTimeString("hi-IN")}
                          </span>
                          {record.check_out_time && (
                            <>
                              <span>→</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Out: {new Date(record.check_out_time).toLocaleTimeString("hi-IN")}
                              </span>
                            </>
                          )}
                        </div>
                        {record.location?.locationName && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {record.location.locationName}
                          </div>
                        )}
                        {record.duration_minutes && (
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                            Duration: {formatDuration(record.duration_minutes)}
                          </p>
                        )}
                      </div>
                      <div>
                        {record.check_out_time ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                            पूर्ण / Complete
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700">
                            प्रगति में / In Progress
                          </Badge>
                        )}
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
