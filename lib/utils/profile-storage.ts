export interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  address?: string
  role: string
  created_at: string
  updated_at: string
}

const PROFILE_KEY = "civicflow_user_profile"

export function getProfileFromStorage(): UserProfile | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(PROFILE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function saveProfileToStorage(profile: UserProfile): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    window.dispatchEvent(new CustomEvent("profileUpdated", { detail: { profile } }))
  } catch (error) {
    console.error("Failed to save profile to localStorage:", error)
  }
}

export function initializeDefaultProfile(): UserProfile {
  const defaultProfile: UserProfile = {
    id: "user_" + Date.now(),
    full_name: "Amit Verma",
    email: "amit.verma@example.com",
    phone: "+91 98765 43210",
    address: "Connaught Place, New Delhi, Delhi 110001",
    role: "citizen",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const existing = getProfileFromStorage()
  if (!existing) {
    saveProfileToStorage(defaultProfile)
  }

  return existing || defaultProfile
}
