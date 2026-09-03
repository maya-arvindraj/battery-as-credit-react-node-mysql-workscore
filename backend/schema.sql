CREATE DATABASE IF NOT EXISTS battery_credit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE battery_credit;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  mobile VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(160) UNIQUE NULL,
  password_hash VARCHAR(255) NULL,
  role ENUM('rider','lender','admin') NOT NULL DEFAULT 'rider',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kyc (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  government_id VARCHAR(80) NULL,
  date_of_birth DATE NULL,
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS work_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  deliveries INT NOT NULL DEFAULT 0,
  monthly_earnings DECIMAL(12,2) NOT NULL DEFAULT 0,
  working_days INT NOT NULL DEFAULT 0,
  payment_reliability DECIMAL(5,2) NOT NULL DEFAULT 0,
  ev_usage_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  delivery_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  earnings_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  work_days_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  repayment_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  ev_usage_score_calculated DECIMAL(5,2) NOT NULL DEFAULT 0,
  score DECIMAL(6,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS financing_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rider_id INT NOT NULL,
  ev_price DECIMAL(12,2) NOT NULL,
  down_payment DECIMAL(12,2) NOT NULL,
  financing_amount DECIMAL(12,2) NOT NULL,
  tenure_months INT NOT NULL,
  monthly_payment DECIMAL(12,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS repayments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (application_id) REFERENCES financing_applications(id) ON DELETE CASCADE
);
