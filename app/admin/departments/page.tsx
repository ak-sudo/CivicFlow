"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Users, FileText, Phone, Mail, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { getReportsFromStorage } from "@/lib/utils/reports-storage"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AdminDepartmentsPage() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    setReports(getReportsFromStorage())
  }, [])

  const departments = [
    {
      code: "PWD",
      name: "सार्वजनिक निर्माण विभाग / Public Works Department",
      description: "Handles roads, potholes, pathways",
      contact_email: "pwd@civicflow.gov.in",
      contact_phone: "+91-11-2345-6789",
      categories: ["pothole", "damaged_pathway", "road_construction"],
      members: [
        { id: "w1", name: "राजेश वर्मा / Rajesh Verma", role: "Senior Engineer", contact: "+91-98765-43210" },
        { id: "w2", name: "संदीप कुमार / Sandeep Kumar", role: "Field Supervisor", contact: "+91-98765-43211" },
        { id: "w3", name: "अमित सिंह / Amit Singh", role: "Junior Engineer", contact: "+91-98765-43212" },
        { id: "w4", name: "विकास शर्मा / Vikas Sharma", role: "Technician", contact: "+91-98765-43213" },
      ],
    },
    {
      code: "SWM",
      name: "ठोस अपशिष्ट प्रबंधन / Solid Waste Management",
      description: "Handles waste collection, disposal",
      contact_email: "swm@civicflow.gov.in",
      contact_phone: "+91-11-2345-6790",
      categories: ["waste_overflow", "illegal_dumping", "carcass_on_road"],
      members: [
        { id: "w5", name: "प्रिया शर्मा / Priya Sharma", role: "Sanitation Officer", contact: "+91-98765-43214" },
        { id: "w6", name: "नेहा गुप्ता / Neha Gupta", role: "Waste Manager", contact: "+91-98765-43215" },
        { id: "w7", name: "रवि कुमार / Ravi Kumar", role: "Collection Supervisor", contact: "+91-98765-43216" },
      ],
    },
    {
      code: "ELECTRICAL",
      name: "विद्युत विभाग / Electrical Department",
      description: "Handles streetlights, power issues",
      contact_email: "electrical@civicflow.gov.in",
      contact_phone: "+91-11-2345-6791",
      categories: ["streetlight_out", "exposed_wires"],
      members: [
        { id: "w8", name: "मोहित पाटिल / Mohit Patil", role: "Chief Electrician", contact: "+91-98765-43217" },
        { id: "w9", name: "सुनील राव / Sunil Rao", role: "Assistant Engineer", contact: "+91-98765-43218" },
      ],
    },
    {
      code: "TRAFFIC",
      name: "यातायात विभाग / Traffic Department",
      description: "Handles traffic signals, road safety",
      contact_email: "traffic@civicflow.gov.in",
      contact_phone: "+91-11-2345-6792",
      categories: ["traffic_signal_broken", "road_construction"],
      members: [
        { id: "w10", name: "अनिल मेहता / Anil Mehta", role: "Traffic Manager", contact: "+91-98765-43219" },
        { id: "w11", name: "दीपक यादव / Deepak Yadav", role: "Signal Technician", contact: "+91-98765-43220" },
      ],
    },
    {
      code: "HEALTH",
      name: "स्वास्थ्य विभाग / Health Department",
      description: "Handles sanitation, health hazards",
      contact_email: "health@civicflow.gov.in",
      contact_phone: "+91-11-2345-6793",
      categories: ["stagnant_water", "carcass_on_road"],
      members: [
        { id: "w12", name: "डॉ. सुमित खन्ना / Dr. Sumit Khanna", role: "Health Inspector", contact: "+91-98765-43221" },
      ],
    },
    {
      code: "SANITATION",
      name: "स्वच्छता विभाग / Sanitation Department",
      description: "Handles public toilets, cleanliness",
      contact_email: "sanitation@civicflow.gov.in",
      contact_phone: "+91-11-2345-6794",
      categories: ["waste_overflow", "illegal_dumping"],
      members: [
        { id: "w13", name: "राजकुमार सिंह / Rajkumar Singh", role: "Sanitation Head", contact: "+91-98765-43222" },
        { id: "w14", name: "मनीष वर्मा / Manish Verma", role: "Field Officer", contact: "+91-98765-43223" },
      ],
    },
  ]

  const getDepartmentStats = (dept: any) => {
    const deptReports = reports.filter((r) => dept.categories.includes(r.category))
    const activeWorkers = dept.members.length
    const activeReports = deptReports.filter((r) => r.status !== "completed" && r.status !== "verified").length

    return { activeWorkers, activeReports, totalReports: deptReports.length }
  }

  const selectedDeptData = departments.find((d) => d.code === selectedDept)
  const selectedDeptReports = selectedDeptData
    ? reports.filter((r) => selectedDeptData.categories.includes(r.category))
    : []

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="ml-64">
        <AdminTopNav userName="राजीव मेनन / Rajiv Menon" />

        <main className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">विभाग / Departments</h1>
                <p className="text-muted-foreground mt-1">Manage municipal departments and operations</p>
              </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept) => {
                const stats = getDepartmentStats(dept)
                return (
                  <Card key={dept.code}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{dept.name}</CardTitle>
                            <CardDescription>{dept.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">{dept.code}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Users className="h-4 w-4" />
                            <span className="text-xs">कार्यकर्ता / Workers</span>
                          </div>
                          <p className="text-lg font-semibold">{stats.activeWorkers}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <FileText className="h-4 w-4" />
                            <span className="text-xs">रिपोर्ट / Reports</span>
                          </div>
                          <p className="text-lg font-semibold">{stats.activeReports}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{dept.contact_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{dept.contact_phone}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setSelectedDept(dept.code)}
                      >
                        विवरण देखें / View Details
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={!!selectedDept} onOpenChange={() => setSelectedDept(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedDeptData?.name}
            </DialogTitle>
            <DialogDescription>{selectedDeptData?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedDeptData?.contact_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedDeptData?.contact_phone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Department Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Department Members ({selectedDeptData?.members.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDeptData?.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Avatar>
                        <AvatarFallback>{member.name.split(" ")[0][0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {member.contact}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Reports ({selectedDeptReports.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDeptReports.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDeptReports.slice(0, 10).map((report) => (
                      <div key={report.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{report.complaint_text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{report.address}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            report.status === "completed" || report.status === "verified"
                              ? "bg-green-500/10 text-green-700"
                              : report.status === "in_progress"
                                ? "bg-yellow-500/10 text-yellow-700"
                                : "bg-blue-500/10 text-blue-700"
                          }
                        >
                          {report.status.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No reports for this department yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
