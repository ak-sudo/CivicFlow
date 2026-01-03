"use client"

import { useState, useEffect } from "react"
import { NavHeader } from "@/components/citizen/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Save } from "lucide-react"
import {
  getProfileFromStorage,
  saveProfileToStorage,
  initializeDefaultProfile,
  type UserProfile,
} from "@/lib/utils/profile-storage"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const userProfile = getProfileFromStorage() || initializeDefaultProfile()
    setProfile(userProfile)
    setFormData({
      full_name: userProfile.full_name,
      email: userProfile.email,
      phone: userProfile.phone || "",
      address: userProfile.address || "",
    })
  }, [])

  const handleSave = () => {
    if (!profile) return

    const updatedProfile: UserProfile = {
      ...profile,
      ...formData,
      updated_at: new Date().toISOString(),
    }

    saveProfileToStorage(updatedProfile)
    setProfile(updatedProfile)
    setIsEditing(false)

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-background">
      <NavHeader userName={profile.full_name} unreadCount={0} />

      <main className="container px-4 md:px-6 py-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings / प्रोफ़ाइल सेटिंग्स</CardTitle>
            <CardDescription>Manage your account information / अपनी खाता जानकारी प्रबंधित करें</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name / पूरा नाम</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email / ईमेल</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone / फोन</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address / पता</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile / प्रोफ़ाइल संपादित करें
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes / बदलाव सहेजें
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                    Cancel / रद्द करें
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
