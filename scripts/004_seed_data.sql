-- Insert departments
INSERT INTO departments (code, name, description, contact_email, contact_phone) VALUES
('PWD', 'Public Works Department', 'Responsible for roads, pathways, and infrastructure', 'pwd@municipal.gov.in', '+91-11-12345678'),
('SWM', 'Solid Waste Management', 'Handles waste collection, disposal, and sanitation', 'swm@municipal.gov.in', '+91-11-12345679'),
('ELECTRICAL', 'Electrical Department', 'Manages streetlights and electrical infrastructure', 'electrical@municipal.gov.in', '+91-11-12345680'),
('TRAFFIC', 'Traffic Management', 'Oversees traffic signals and road safety', 'traffic@municipal.gov.in', '+91-11-12345681'),
('HEALTH', 'Health Department', 'Handles public health and sanitation', 'health@municipal.gov.in', '+91-11-12345682'),
('SANITATION', 'Sanitation Department', 'Manages public toilets and cleanliness', 'sanitation@municipal.gov.in', '+91-11-12345683'),
('HELPDESK', 'Municipal Helpdesk', 'General municipal assistance', 'helpdesk@municipal.gov.in', '+91-11-12345684')
ON CONFLICT (code) DO NOTHING;

-- Insert sample coupons
INSERT INTO coupons_catalog (name, description, points_cost, discount_type, discount_value, category, terms_and_conditions, is_active) VALUES
('Toll Tax Discount Coupon', 'Flat 10% discount on applicable toll booths across the city', 500, 'percentage', '10%', 'toll', 'Valid for 30 days from redemption. Applicable on select toll plazas. Cannot be clubbed with other offers.', TRUE),
('Water Bill Rebate', 'Rs. 50 rebate on your next water bill payment', 300, 'fixed', 'Rs. 50', 'water', 'Valid for one-time use within 30 days. Minimum bill amount Rs. 200 required.', TRUE),
('Electricity Bill Processing Fee Waiver', 'Complete waiver on monthly processing charges for electricity bill', 400, 'waiver', 'Processing Fee', 'electricity', 'Valid for one billing cycle. Auto-applied on next bill payment.', TRUE),
('Municipal Parking Discount', '20% off at participating municipal parking lots', 250, 'percentage', '20%', 'parking', 'Valid for 30 days. Show coupon code at entry. Maximum discount Rs. 100 per visit.', TRUE),
('Bus Fare Discount Pass', '15% discount for 3 bus rides on city transport', 350, 'percentage', '15%', 'transport', 'Valid for 3 rides within 30 days. Scan QR code while boarding.', TRUE),
('Property Tax Processing Fee Waiver', 'Waiver on property tax processing charges', 600, 'waiver', 'Processing Fee', 'property', 'Valid for annual property tax payment. One-time use only.', TRUE),
('Public Swimming Pool Entry', 'Free entry to municipal swimming pool for 1 month', 800, 'waiver', 'Entry Fee', 'recreation', 'Valid for 1 month from redemption. Valid government ID required at entry.', TRUE),
('Municipal Library Membership', 'Free 6-month membership to city library', 450, 'waiver', 'Membership Fee', 'education', 'New memberships only. Access to all branches and online resources.', TRUE)
ON CONFLICT DO NOTHING;
