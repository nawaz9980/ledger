'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encrypt, USERS } from "@/lib/auth";

export async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const user = USERS.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return { success: false, message: "Invalid credentials" };
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const session = await encrypt({ user: { id: user.id, name: user.name, username: user.username, role: user.role }, expires });

    const cookieStore = await cookies();

    // Save the session in a cookie
    cookieStore.set("session", session, { expires, httpOnly: true });

    redirect("/");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/login");
}
