"use client"

import { useState } from "react"
import { WorkerNavHeader } from "@/components/worker/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Briefcase, Star } from "lucide-react"

export default function WorkerProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "अजय सिंह / Ajay Singh",
    email: "ajay.singh@civicflow.gov.in",
    phone: "+91 98765 43210",
    department: "PWD (सार्वजनिक निर्माण विभाग)",
    employee_id: "PWD2024-1247",
    address: "Sector 15, Rohini, New Delhi, Delhi 110085",
    total_completed_tasks: 142,
    average_rating: 4.7,
    joined_date: "15 Jan 2023",
  })

  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <WorkerNavHeader userName={profile.full_name} />

      <main className="container px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">प्रोफ़ाइल / Profile</h1>
            <p className="text-muted-foreground mt-1">View and manage your worker profile</p>
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{profile.full_name}</CardTitle>
                    <CardDescription>{profile.department}</CardDescription>
                  </div>
                </div>
                <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "सहेजें / Save" : "संपादित करें / Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-semibold">व्यक्तिगत जानकारी / Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">पूरा नाम / Full Name</Label>
                    <Input
                      id="name"
                      value={profile.full_name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee_id">कर्मचारी आईडी / Employee ID</Label>
                    <Input id="employee_id" value={profile.employee_id} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">ईमेल / Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">फ़ोन / Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">पता / Address</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profile.address}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Work Stats */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-semibold">कार्य सांख्यिकी / Work Statistics</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">विभाग / Department</span>
                    </div>
                    <p className="font-semibold">{profile.department}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Star className="h-4 w-4" />
                      <span className="text-sm">औसत रेटिंग / Avg Rating</span>
                    </div>
                    <p className="font-semibold">{profile.average_rating} / 5.0</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">कुल कार्य / Total Tasks</span>
                    </div>
                    <p className="font-semibold">{profile.total_completed_tasks}</p>
                  </div>
                </div>
              </div>

              {/* Employment Info */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-semibold">रोजगार जानकारी / Employment Information</h3>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="text-sm text-muted-foreground">शामिल हुए / Joined</p>
                    <p className="font-semibold">{profile.joined_date}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                    सक्रिय / Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
