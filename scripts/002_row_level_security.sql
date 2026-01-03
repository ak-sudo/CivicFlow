-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeemed_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Workers can view their own and citizen profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('worker', 'admin'))
  );

-- Reports policies
CREATE POLICY "Citizens can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (
    auth.uid() = reporter_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('worker', 'admin'))
  );

CREATE POLICY "Workers can view assigned reports" ON reports
  FOR SELECT USING (
    auth.uid() = assigned_worker_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Workers can update assigned reports" ON reports
  FOR UPDATE USING (
    auth.uid() = assigned_worker_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all reports" ON reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Report images policies
CREATE POLICY "Users can upload images for their reports" ON report_images
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM reports WHERE id = report_id AND reporter_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM reports WHERE id = report_id AND assigned_worker_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view images of accessible reports" ON report_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reports r 
      WHERE r.id = report_id AND (
        r.reporter_id = auth.uid() OR 
        r.assigned_worker_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Departments policies (public read)
CREATE POLICY "Anyone can view departments" ON departments
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage departments" ON departments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Workers policies
CREATE POLICY "Workers can view their own data" ON workers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all workers" ON workers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage workers" ON workers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Worker attendance policies
CREATE POLICY "Workers can manage their attendance" ON worker_attendance
  FOR ALL USING (auth.uid() = worker_id);

CREATE POLICY "Admins can view all attendance" ON worker_attendance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Report timeline policies (read-only for users, admins can write)
CREATE POLICY "Users can view timeline of accessible reports" ON report_timeline
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reports r 
      WHERE r.id = report_id AND (
        r.reporter_id = auth.uid() OR 
        r.assigned_worker_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "System can create timeline entries" ON report_timeline
  FOR INSERT WITH CHECK (TRUE);

-- User wallets policies
CREATE POLICY "Users can view their own wallet" ON user_wallets
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all wallets" ON user_wallets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Coupons catalog policies (public read)
CREATE POLICY "Anyone can view active coupons" ON coupons_catalog
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage coupons" ON coupons_catalog
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Redeemed coupons policies
CREATE POLICY "Users can view their redeemed coupons" ON redeemed_coupons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can redeem coupons" ON redeemed_coupons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (TRUE);
