"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "hi"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Common
  "app.name": { en: "CivicFlow", hi: "सिविकफ्लो" },
  "app.tagline": { en: "Civic Reporting Platform", hi: "नागरिक रिपोर्टिंग मंच" },
  "search.placeholder": { en: "Search reports, addresses, IDs...", hi: "रिपोर्ट, पते, आईडी खोजें..." },
  language: { en: "Language", hi: "भाषा" },

  // Admin Dashboard
  "admin.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "admin.reports": { en: "Reports", hi: "रिपोर्ट" },
  "admin.map": { en: "Map View", hi: "मानचित्र दृश्य" },
  "admin.review": { en: "Human Review", hi: "मानव समीक्षा" },
  "admin.workers": { en: "Workers", hi: "कार्यकर्ता" },
  "admin.departments": { en: "Departments", hi: "विभाग" },
  "admin.analytics": { en: "Analytics", hi: "विश्लेषण" },
  "admin.audit": { en: "Audit Logs", hi: "ऑडिट लॉग" },
  "admin.settings": { en: "Settings", hi: "सेटिंग्स" },
  "admin.panel": { en: "Admin Panel", hi: "प्रशासन पैनल" },

  // Stats
  "stats.total_open": { en: "Total Open Reports", hi: "कुल खुली रिपोर्ट" },
  "stats.resolved_today": { en: "Resolved Today", hi: "आज हल किया" },
  "stats.avg_time": { en: "Avg Resolution Time", hi: "औसत समय" },
  "stats.needs_review": { en: "Needs Human Review", hi: "मानव समीक्षा चाहिए" },
  "stats.active_workers": { en: "Active Workers", hi: "सक्रिय कार्यकर्ता" },

  // Report statuses
  "status.submitted": { en: "Submitted", hi: "प्रस्तुत" },
  "status.assigned": { en: "Assigned", hi: "सौंपा गया" },
  "status.in_progress": { en: "In Progress", hi: "प्रगति में" },
  "status.completed": { en: "Completed", hi: "पूर्ण" },
  "status.verified": { en: "Verified", hi: "सत्यापित" },
  "status.needs_human_review": { en: "Needs Review", hi: "समीक्षा चाहिए" },

  // Severity
  "severity.low": { en: "Low", hi: "कम" },
  "severity.medium": { en: "Medium", hi: "मध्यम" },
  "severity.high": { en: "High", hi: "उच्च" },
  "severity.critical": { en: "Critical", hi: "गंभीर" },

  // Actions
  "action.view": { en: "View", hi: "देखें" },
  "action.edit": { en: "Edit", hi: "संपादित करें" },
  "action.delete": { en: "Delete", hi: "हटाएं" },
  "action.assign": { en: "Assign", hi: "सौंपें" },
  "action.approve": { en: "Approve", hi: "स्वीकार करें" },
  "action.reject": { en: "Reject", hi: "अस्वीकार करें" },
  "action.logout": { en: "Logout", hi: "लॉग आउट" },

  // Categories
  "category.pothole": { en: "Pothole", hi: "गड्ढा" },
  "category.waste_overflow": { en: "Waste Overflow", hi: "कचरा अतिप्रवाह" },
  "category.streetlight_out": { en: "Streetlight Out", hi: "स्ट्रीट लाइट बंद" },
  "category.traffic_signal": { en: "Traffic Signal Fault", hi: "ट्रैफिक सिग्नल खराब" },
  "category.other": { en: "Other", hi: "अन्य" },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load language from localStorage
    const saved = localStorage.getItem("civicflow-language") as Language
    if (saved === "en" || saved === "hi") {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("civicflow-language", lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
