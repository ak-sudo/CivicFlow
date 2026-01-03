"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle, Clock, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getWorkerAttendanceHistory, formatDuration } from "@/lib/utils/attendance-storage"

export default function AdminWorkersPage() {
  const profile = { full_name: "डॉ. अनिल कुमार / Dr. Anil Kumar", role: "admin" as const }
  const [selectedWorker, setSelectedWorker] = useState<any>(null)
  const [workerAttendance, setWorkerAttendance] = useState<any[]>([])

  const workers = [
    {
      id: "1",
      full_name: "राजेश वर्मा / Rajesh Verma",
      worker_id: "PWD-2024-001",
      department: "PWD",
      phone: "+91 98765 43210",
      email: "rajesh.verma@delhi.gov.in",
      address: "Sector 15, Rohini, New Delhi - 110085",
      current_tasks_count: 5,
      total_completed_tasks: 142,
      average_rating: 4.7,
      is_available: true,
      skills: ["Road Repair", "Pothole Filling", "Asphalt Work"],
      joined_date: "2022-01-15",
    },
    {
      id: "2",
      full_name: "प्रदीप सिंह / Pradeep Singh",
      worker_id: "SWM-2024-012",
      department: "SWM",
      phone: "+91 98765 43211",
      email: "pradeep.singh@delhi.gov.in",
      address: "Karol Bagh, Central Delhi - 110005",
      current_tasks_count: 3,
      total_completed_tasks: 98,
      average_rating: 4.5,
      is_available: true,
      skills: ["Waste Management", "Garbage Collection", "Recycling"],
      joined_date: "2022-03-20",
    },
    {
      id: "3",
      full_name: "संजय कुमार / Sanjay Kumar",
      worker_id: "ELEC-2024-007",
      department: "ELECTRICAL",
      phone: "+91 98765 43212",
      email: "sanjay.kumar@delhi.gov.in",
      address: "Laxmi Nagar, East Delhi - 110092",
      current_tasks_count: 7,
      total_completed_tasks: 215,
      average_rating: 4.9,
      is_available: false,
      skills: ["Electrical Repair", "Streetlight Maintenance", "Wiring"],
      joined_date: "2021-06-10",
    },
    {
      id: "4",
      full_name: "विकास गुप्ता / Vikas Gupta",
      worker_id: "TRAF-2024-019",
      department: "TRAFFIC",
      phone: "+91 98765 43213",
      email: "vikas.gupta@delhi.gov.in",
      address: "Dwarka Sector 10, South West Delhi - 110075",
      current_tasks_count: 4,
      total_completed_tasks: 87,
      average_rating: 4.3,
      is_available: true,
      skills: ["Traffic Signal Repair", "Road Safety", "Signal Installation"],
      joined_date: "2022-08-05",
    },
    {
      id: "5",
      full_name: "अमित शर्मा / Amit Sharma",
      worker_id: "PWD-2024-022",
      department: "PWD",
      phone: "+91 98765 43214",
      email: "amit.sharma@delhi.gov.in",
      address: "Vasant Vihar, South Delhi - 110057",
      current_tasks_count: 6,
      total_completed_tasks: 156,
      average_rating: 4.6,
      is_available: true,
      skills: ["Road Repair", "Pathway Construction", "Drainage"],
      joined_date: "2021-11-12",
    },
  ]

  useEffect(() => {
    if (selectedWorker) {
      const attendance = getWorkerAttendanceHistory(selectedWorker.id, 10)
      setWorkerAttendance(attendance)
    }
  }, [selectedWorker])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-y-auto">
        <AdminTopNav userName={profile.full_name} />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">कार्यकर्ता / Workers</h1>
                <p className="text-muted-foreground mt-1">Manage municipal workers and assignments</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">कुल कार्यकर्ता / Total Workers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workers.length}</div>
                  <p className="text-xs text-muted-foreground">Registered municipal workers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">उपलब्ध / Available</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workers.filter((w) => w.is_available).length}</div>
                  <p className="text-xs text-muted-foreground">Ready for assignments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">सक्रिय कार्य / Active Tasks</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workers.reduce((sum, w) => sum + w.current_tasks_count, 0)}</div>
                  <p className="text-xs text-muted-foreground">Currently assigned</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>सभी कार्यकर्ता / All Workers</CardTitle>
                <CardDescription>View and manage worker profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workers.map((worker) => (
                    <div
                      key={worker.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{worker.full_name}</p>
                          <p className="text-sm text-muted-foreground">{worker.department} Department</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium">{worker.current_tasks_count} Active</p>
                          <p className="text-xs text-muted-foreground">{worker.total_completed_tasks} Completed</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium">⭐ {worker.average_rating}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>

                        <Badge
                          variant="secondary"
                          className={
                            worker.is_available ? "bg-green-500/10 text-green-700" : "bg-gray-500/10 text-gray-700"
                          }
                        >
                          {worker.is_available ? "उपलब्ध / Available" : "व्यस्त / Busy"}
                        </Badge>

                        <Button variant="outline" size="sm" onClick={() => setSelectedWorker(worker)}>
                          विवरण देखें / View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Worker ID Card Details</DialogTitle>
            <DialogDescription>Complete biodata and employment information</DialogDescription>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-6">
              {/* ID Card Style Display */}
              <div className="border-2 border-primary rounded-lg p-6 bg-gradient-to-br from-primary/5 to-background">
                <div className="flex items-start gap-6">
                  <div className="h-32 w-32 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-16 w-16 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{selectedWorker.full_name}</h3>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-semibold">Worker ID:</span> {selectedWorker.worker_id}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Department:</span> {selectedWorker.department}
                      </p>
                      <Badge
                        variant="secondary"
                        className={
                          selectedWorker.is_available
                            ? "bg-green-500/10 text-green-700"
                            : "bg-gray-500/10 text-gray-700"
                        }
                      >
                        {selectedWorker.is_available ? "Available" : "Busy"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Phone Number</p>
                  <p className="font-medium">{selectedWorker.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Email Address</p>
                  <p className="font-medium text-sm">{selectedWorker.email}</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Residential Address</p>
                <p className="font-medium">{selectedWorker.address}</p>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Skills & Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {selectedWorker.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedWorker.current_tasks_count}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedWorker.total_completed_tasks}</p>
                  <p className="text-xs text-muted-foreground mt-1">Completed Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">⭐ {selectedWorker.average_rating}</p>
                  <p className="text-xs text-muted-foreground mt-1">Average Rating</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Attendance Records</h3>
                </div>

                {workerAttendance.length > 0 ? (
                  <div className="space-y-3">
                    {/* Attendance Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <p className="text-xl font-bold text-primary">{workerAttendance.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Days</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-primary">
                          {workerAttendance.filter((a) => a.check_out_time).length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Completed Shifts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-primary">
                          {formatDuration(
                            Math.floor(
                              workerAttendance
                                .filter((a) => a.duration_minutes)
                                .reduce((sum, a) => sum + (a.duration_minutes || 0), 0) /
                                workerAttendance.filter((a) => a.duration_minutes).length || 0,
                            ),
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Duration</p>
                      </div>
                    </div>

                    {/* Recent Attendance Records */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {workerAttendance.map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <p className="text-sm font-medium">
                                {new Date(record.date).toLocaleDateString("en-IN", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>In: {new Date(record.check_in_time).toLocaleTimeString("en-IN")}</span>
                              {record.check_out_time && (
                                <>
                                  <span>→</span>
                                  <span>Out: {new Date(record.check_out_time).toLocaleTimeString("en-IN")}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {record.duration_minutes ? (
                              <>
                                <p className="text-sm font-semibold text-blue-600">
                                  {formatDuration(record.duration_minutes)}
                                </p>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-700 text-xs">
                                  Complete
                                </Badge>
                              </>
                            ) : (
                              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 text-xs">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No attendance records found</p>
                  </div>
                )}
              </div>

              {/* Employment Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Date of Joining</p>
                  <p className="font-medium">{new Date(selectedWorker.joined_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Department Code</p>
                  <p className="font-medium">{selectedWorker.department}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
