-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better type safety
CREATE TYPE user_role AS ENUM ('citizen', 'worker', 'admin');
CREATE TYPE report_status AS ENUM ('submitted', 'assigned', 'in_progress', 'completed', 'verified', 'needs_human_review');
CREATE TYPE report_category AS ENUM (
  'pothole', 
  'waste_overflow', 
  'streetlight_out', 
  'traffic_signal_fault', 
  'carcass_on_road', 
  'public_toilet_unclean', 
  'damaged_pathway', 
  'other'
);
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE department_code AS ENUM ('PWD', 'SWM', 'ELECTRICAL', 'TRAFFIC', 'HEALTH', 'SANITATION', 'HELPDESK');
CREATE TYPE transaction_type AS ENUM ('report_submitted', 'report_verified', 'task_completed', 'coupon_redeemed');
CREATE TYPE coupon_status AS ENUM ('active', 'redeemed', 'expired');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reports table (main civic issues)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category report_category,
  status report_status NOT NULL DEFAULT 'submitted',
  complaint_text TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  severity_score INTEGER CHECK (severity_score >= 0 AND severity_score <= 100),
  severity_level severity_level,
  ai_analysis JSONB,
  needs_human_review BOOLEAN DEFAULT FALSE,
  assigned_department department_code,
  assigned_worker_id UUID REFERENCES profiles(id),
  estimated_sla TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ
);

-- Report images table
CREATE TABLE IF NOT EXISTS report_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT CHECK (image_type IN ('original', 'proof', 'cropped_evidence')),
  geotag_latitude DOUBLE PRECISION,
  geotag_longitude DOUBLE PRECISION,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  code department_code PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workers table (additional worker-specific data)
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  department department_code NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  max_tasks_per_day INTEGER DEFAULT 10,
  current_tasks_count INTEGER DEFAULT 0,
  total_completed_tasks INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Worker attendance table
CREATE TABLE IF NOT EXISTS worker_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_in_latitude DOUBLE PRECISION NOT NULL,
  check_in_longitude DOUBLE PRECISION NOT NULL,
  check_out_time TIMESTAMPTZ,
  check_out_latitude DOUBLE PRECISION,
  check_out_longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Timeline/Audit trail table
CREATE TABLE IF NOT EXISTS report_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  actor_name TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rewards/Incentives wallet table
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  points_balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactions table (points history)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type transaction_type NOT NULL,
  points_amount INTEGER NOT NULL,
  related_report_id UUID REFERENCES reports(id),
  related_coupon_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Coupons catalog table
CREATE TABLE IF NOT EXISTS coupons_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  discount_type TEXT, -- 'percentage', 'fixed', 'waiver'
  discount_value TEXT,
  category TEXT, -- 'toll', 'water', 'electricity', 'parking', 'transport'
  terms_and_conditions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User redeemed coupons table
CREATE TABLE IF NOT EXISTS redeemed_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coupon_catalog_id UUID NOT NULL REFERENCES coupons_catalog(id),
  coupon_code TEXT UNIQUE NOT NULL,
  status coupon_status NOT NULL DEFAULT 'active',
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  qr_code_url TEXT
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT, -- 'report_update', 'assignment', 'reward', 'system'
  related_report_id UUID REFERENCES reports(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_assigned_worker ON reports(assigned_worker_id);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_report_images_report_id ON report_images(report_id);
CREATE INDEX idx_report_timeline_report_id ON report_timeline(report_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_worker_attendance_worker_id ON worker_attendance(worker_id);

-- Create full-text search index on reports
CREATE INDEX idx_reports_search ON reports USING gin(to_tsvector('english', complaint_text || ' ' || COALESCE(address, '')));
