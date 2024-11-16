import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Lista de rotas protegidas (todas dentro do grupo app)
  const protectedRoutes = [
    '/dashboard',
    '/products',
    '/roadmap',
    '/features',
    '/customers',
    '/analytics',
    '/settings',
    '/profile'
  ]

  // Lista de rotas públicas
  const publicRoutes = ['/login', '/signup', '/landing', '/']

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route
  )

  // Se estiver em uma rota pública e autenticado, redireciona para o dashboard
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Se estiver em uma rota protegida e não autenticado, redireciona para o login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 