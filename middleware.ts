import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/']
const publicRoutes = ['/login']

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route)) || path === '/'
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value
    const session = cookie ? await decrypt(cookie) : null

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session && !path.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 5. Redirect to /dashboard (or home) if the user is authenticated and tries to access /login
    if (
        isPublicRoute &&
        session &&
        !req.nextUrl.pathname.startsWith('/')
    ) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // 6. Redirect authenticated users away from login page if they access it
    if (path === '/login' && session) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    // 7. Protect /boss route for admin only
    if (path.startsWith('/boss') && session?.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }


    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
