'use server'

import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from 'uuid';
import { getSession } from "@/lib/auth";

export interface Bill {
    id: string;
    company_id: string;
    date: Date;
    invoice_number: string;
    amount: number;
    status: 'PENDING' | 'PAID';
    type: 'DEBIT' | 'CREDIT';
    created_at: Date;
    company?: {
        name: string;
    };
}

export async function createBill(data: {
    companyId: string
    date: Date
    invoiceNumber: string
    amount: number
    type?: 'DEBIT' | 'CREDIT'
}) {
    try {
        const id = uuidv4();
        const type = data.type || 'DEBIT';
        // Format date for MySQL DATETIME
        const dateStr = data.date.toISOString().slice(0, 19).replace('T', ' ');

        await pool.execute(
            `INSERT INTO bills (id, company_id, date, invoice_number, amount, status, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, data.companyId, dateStr, data.invoiceNumber, data.amount, type === 'CREDIT' ? 'PAID' : 'PENDING', type]
        );

        revalidatePath(`/companies/${data.companyId}`)
        revalidatePath("/boss")
        return { success: true, data: { id, ...data } }
    } catch (error) {
        console.error("Create bill error:", error);
        return { success: false, error: "Failed to create bill" }
    }
}

export async function toggleBillStatus(id: string, currentStatus: 'PENDING' | 'PAID') {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        return { success: false, error: "Unauthorized: Only Admins can change bill status" }
    }

    try {
        const newStatus = currentStatus === 'PENDING' ? 'PAID' : 'PENDING';

        await pool.execute(
            'UPDATE bills SET status = ? WHERE id = ?',
            [newStatus, id]
        );

        // Fetch updated bill to get companyId for revalidation
        const [rows] = await pool.execute('SELECT company_id FROM bills WHERE id = ?', [id]);
        const bills = rows as any[];

        if (bills.length > 0) {
            revalidatePath(`/companies/${bills[0].company_id}`)
        }
        revalidatePath("/boss")

        return { success: true, data: { id, status: newStatus } }
    } catch (error) {
        console.error("Toggle bill status error:", error);
        return { success: false, error: "Failed to update bill status" }
    }
}

export async function getAllBills() {
    try {
        const [rows] = await pool.execute(`
      SELECT b.*, c.name as company_name 
      FROM bills b 
      JOIN companies c ON b.company_id = c.id 
      ORDER BY b.date DESC
    `);

        // Map result to match expected shape if needed, mostly doing this for type safety in frontend
        const bills = (rows as any[]).map(row => ({
            ...row,
            company: { name: row.company_name }
        }));

        return { success: true, data: bills }
    } catch (error) {
        console.error("Get all bills error:", error);
        return { success: false, error: "Failed to fetch bills" }
    }
}
