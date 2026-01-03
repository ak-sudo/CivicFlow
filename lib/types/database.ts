export type UserRole = "citizen" | "worker" | "admin"

export type ReportStatus = "submitted" | "assigned" | "in_progress" | "completed" | "verified" | "needs_human_review"

export type ReportCategory =
  | "pothole"
  | "waste_overflow"
  | "streetlight_out"
  | "traffic_signal_fault"
  | "carcass_on_road"
  | "public_toilet_unclean"
  | "damaged_pathway"
  | "other"

export type SeverityLevel = "low" | "medium" | "high" | "critical"

export type DepartmentCode = "PWD" | "SWM" | "ELECTRICAL" | "TRAFFIC" | "HEALTH" | "SANITATION" | "HELPDESK"

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  reporter_id: string
  category: ReportCategory | null
  status: ReportStatus
  complaint_text: string
  latitude: number
  longitude: number
  address: string | null
  severity_score: number | null
  severity_level: SeverityLevel | null
  ai_analysis: AIAnalysis | null
  needs_human_review: boolean
  assigned_department: DepartmentCode | null
  assigned_worker_id: string | null
  estimated_sla: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  verified_at: string | null
}

export interface AIAnalysis {
  gemini_raw?: any
  predicted_category?: ReportCategory
  category_confidence?: number
  final_severity?: number
  severity_components?: {
    model: number
    poi_proximity?: number
    repeat_reports?: number
    time_sensitivity?: number
  }
  recommended_departments?: Array<{
    department_code: DepartmentCode
    department_name: string
    priority: "high" | "medium" | "low"
  }>
  evidence?: {
    bounding_boxes?: Array<{
      label: string
      confidence: number
      bbox: [number, number, number, number]
    }>
    cropped_image_urls?: string[]
  }
  raw_visual_evidence?: string[]
  risk_note?: string
  explainability_notes?: string
  needs_human_review?: boolean
  processed_at?: string
}

export interface ReportImage {
  id: string
  report_id: string
  image_url: string
  image_type: "original" | "proof" | "cropped_evidence"
  geotag_latitude: number | null
  geotag_longitude: number | null
  uploaded_by: string
  created_at: string
}

export interface Department {
  code: DepartmentCode
  name: string
  description: string | null
  contact_email: string | null
  contact_phone: string | null
  created_at: string
}

export interface Worker {
  id: string
  department: DepartmentCode
  is_available: boolean
  max_tasks_per_day: number
  current_tasks_count: number
  total_completed_tasks: number
  average_rating: number | null
  created_at: string
}

export interface TimelineEntry {
  id: string
  report_id: string
  action: string
  actor_id: string | null
  actor_name: string | null
  details: any
  created_at: string
}

export interface UserWallet {
  id: string
  points_balance: number
  total_earned: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  transaction_type: "report_submitted" | "report_verified" | "task_completed" | "coupon_redeemed"
  points_amount: number
  related_report_id: string | null
  related_coupon_id: string | null
  description: string | null
  created_at: string
}

export interface CouponCatalog {
  id: string
  name: string
  description: string
  points_cost: number
  discount_type: string | null
  discount_value: string | null
  category: string | null
  terms_and_conditions: string | null
  is_active: boolean
  created_at: string
}

export interface RedeemedCoupon {
  id: string
  user_id: string
  coupon_catalog_id: string
  coupon_code: string
  status: "active" | "redeemed" | "expired"
  redeemed_at: string
  valid_until: string
  used_at: string | null
  qr_code_url: string | null
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string | null
  related_report_id: string | null
  is_read: boolean
  created_at: string
}
