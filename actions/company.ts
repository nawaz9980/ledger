'use server'

import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from 'uuid';

export interface Company {
    id: string;
    name: string;
    created_at: Date;
    bills?: any[]; // Simplified for now
}

export async function createCompany(name: string) {
    try {
        const id = uuidv4();
        await pool.execute(
            'INSERT INTO companies (id, name) VALUES (?, ?)',
            [id, name]
        );

        revalidatePath("/companies")
        return { success: true, data: { id, name } }
    } catch (error) {
        console.error("Create company error:", error);
        return { success: false, error: "Failed to create company" }
    }
}

export async function getCompanies() {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM companies ORDER BY created_at DESC'
        );
        return { success: true, data: rows as Company[] }
    } catch (error) {
        console.error("Get companies error:", error);
        return { success: false, error: "Failed to fetch companies" }
    }
}

export async function getCompany(id: string) {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM companies WHERE id = ?',
            [id]
        );
        const companies = rows as Company[];

        if (companies.length === 0) {
            return { success: false, error: "Company not found" }
        }

        const company = companies[0];

        // Get bills for this company
        const [billRows] = await pool.execute(
            'SELECT * FROM bills WHERE company_id = ? ORDER BY date DESC',
            [id]
        );

        company.bills = billRows as any[];

        return { success: true, data: company }
    } catch (error) {
        console.error("Get company error:", error);
        return { success: false, error: "Failed to fetch company" }
    }
}
