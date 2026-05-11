-- Insert admin and clerk users with bcrypt hashed passwords
-- admin123 and clerk123 hashed with bcrypt (cost 10)
INSERT INTO User (id, email, name, hashedPassword, role, createdAt, updatedAt) VALUES 
('admin-id', 'admin@bloodbank.com', 'Admin User', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NOW(), NOW()),
('clerk-id', 'clerk@bloodbank.com', 'Clerk User', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLERK', NOW(), NOW())
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Insert blood inventory for all blood types
INSERT INTO BloodInventory (id, bloodType, rhFactor, unitsAvailable, minimumStock, lastUpdated, createdAt, updatedAt) VALUES
('inv-a-pos', 'A', '+', 10, 5, NOW(), NOW(), NOW()),
('inv-a-neg', 'A', '-', 8, 5, NOW(), NOW(), NOW()),
('inv-b-pos', 'B', '+', 12, 5, NOW(), NOW(), NOW()),
('inv-b-neg', 'B', '-', 6, 5, NOW(), NOW(), NOW()),
('inv-ab-pos', 'AB', '+', 5, 5, NOW(), NOW(), NOW()),
('inv-ab-neg', 'AB', '-', 3, 5, NOW(), NOW(), NOW()),
('inv-o-pos', 'O', '+', 15, 5, NOW(), NOW(), NOW()),
('inv-o-neg', 'O', '-', 7, 5, NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE unitsAvailable=VALUES(unitsAvailable);
