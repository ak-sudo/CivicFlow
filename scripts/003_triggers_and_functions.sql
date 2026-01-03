-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'citizen')
  );
  
  -- Create wallet for new user
  INSERT INTO user_wallets (id, points_balance, total_earned, total_spent)
  VALUES (NEW.id, 0, 0, 0);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_wallets_updated_at BEFORE UPDATE ON user_wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create timeline entry when report status changes
CREATE OR REPLACE FUNCTION log_report_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO report_timeline (report_id, action, actor_id, details)
    VALUES (
      NEW.id,
      'Status changed to ' || NEW.status,
      auth.uid(),
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER report_status_change_trigger
  AFTER UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION log_report_status_change();

-- Function to update worker task count
CREATE OR REPLACE FUNCTION update_worker_task_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- When task is assigned, increment current count
    IF (NEW.status = 'assigned' AND OLD.assigned_worker_id IS NULL AND NEW.assigned_worker_id IS NOT NULL) THEN
      UPDATE workers 
      SET current_tasks_count = current_tasks_count + 1
      WHERE id = NEW.assigned_worker_id;
    END IF;
    
    -- When task is completed, decrement current and increment total
    IF (NEW.status = 'completed' AND NEW.assigned_worker_id IS NOT NULL) THEN
      UPDATE workers 
      SET 
        current_tasks_count = GREATEST(current_tasks_count - 1, 0),
        total_completed_tasks = total_completed_tasks + 1
      WHERE id = NEW.assigned_worker_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER worker_task_count_trigger
  AFTER UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_task_count();

-- Function to handle reward points
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_transaction_type transaction_type,
  p_report_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update wallet balance
  UPDATE user_wallets
  SET 
    points_balance = points_balance + p_points,
    total_earned = total_earned + p_points
  WHERE id = p_user_id;
  
  -- Create transaction record
  INSERT INTO transactions (user_id, transaction_type, points_amount, related_report_id, description)
  VALUES (p_user_id, p_transaction_type, p_points, p_report_id, p_description);
  
  -- Create notification
  INSERT INTO notifications (user_id, title, message, type, related_report_id)
  VALUES (
    p_user_id,
    'Points Earned!',
    'You have earned ' || p_points || ' points. ' || COALESCE(p_description, ''),
    'reward',
    p_report_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct points for coupon redemption
CREATE OR REPLACE FUNCTION redeem_coupon(
  p_user_id UUID,
  p_coupon_catalog_id UUID,
  p_points_cost INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_coupon_id UUID;
  v_coupon_code TEXT;
BEGIN
  -- Check if user has enough points
  IF (SELECT points_balance FROM user_wallets WHERE id = p_user_id) < p_points_cost THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;
  
  -- Generate unique coupon code
  v_coupon_code := 'CF-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  
  -- Deduct points
  UPDATE user_wallets
  SET 
    points_balance = points_balance - p_points_cost,
    total_spent = total_spent + p_points_cost
  WHERE id = p_user_id;
  
  -- Create transaction record
  INSERT INTO transactions (user_id, transaction_type, points_amount, related_coupon_id, description)
  VALUES (p_user_id, 'coupon_redeemed', -p_points_cost, p_coupon_catalog_id, 'Coupon redeemed');
  
  -- Create redeemed coupon
  INSERT INTO redeemed_coupons (user_id, coupon_catalog_id, coupon_code, valid_until)
  VALUES (p_user_id, p_coupon_catalog_id, v_coupon_code, NOW() + INTERVAL '30 days')
  RETURNING id INTO v_coupon_id;
  
  -- Create notification
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    p_user_id,
    'Coupon Redeemed!',
    'Your coupon code: ' || v_coupon_code,
    'reward'
  );
  
  RETURN v_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
