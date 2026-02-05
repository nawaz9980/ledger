import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = "your-secret-key-change-this-in-env"; // In suitable implementation, use process.env.SESSION_SECRET
const key = new TextEncoder().encode(SECRET_KEY);

export type Role = "admin" | "sales";

export type User = {
    id: string;
    name: string;
    username: string;
    role: Role;
};

// Hardcoded users as per request
interface UserWithPassword extends User {
    password: string;
}

export const USERS: UserWithPassword[] = [
    {
        id: "1",
        name: "Sales User",
        username: "sales",
        password: "Sales@123",
        role: "sales",
    },
    {
        id: "2",
        name: "Admin User",
        username: "WHITETAG",
        password: "Whitetag@123",
        role: "admin",
    },
];

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;

    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}
