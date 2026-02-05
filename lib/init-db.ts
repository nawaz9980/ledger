import 'dotenv/config';
import { pool } from '@/lib/db';

export async function initializeDatabase() {
  const createCompaniesTable = `
    CREATE TABLE IF NOT EXISTS companies (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createBillsTable = `
    CREATE TABLE IF NOT EXISTS bills (
      id VARCHAR(255) PRIMARY KEY,
      company_id VARCHAR(255) NOT NULL,
      date DATETIME NOT NULL,
      invoice_number VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      status ENUM('PENDING', 'PAID') DEFAULT 'PENDING',
      type ENUM('DEBIT', 'CREDIT') DEFAULT 'DEBIT',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    );
  `;

  const migrateBillsTable = `
    ALTER TABLE bills ADD COLUMN IF NOT EXISTS type ENUM('DEBIT', 'CREDIT') DEFAULT 'DEBIT' AFTER status;
  `;

  try {
    await pool.execute(createCompaniesTable);
    console.log('Companies table checked/created.');
    await pool.execute(createBillsTable);
    console.log('Bills table checked/created.');
    try {
      await pool.execute(migrateBillsTable);
      console.log('Bills table migrated (if needed).');
    } catch (e) {
      // Ignore if column already exists or other non-critical issues
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
