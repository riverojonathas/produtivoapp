import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não está autenticado
  if (!session) {
    if (req.nextUrl.pathname.startsWith('/dashboard') || 
        req.nextUrl.pathname.startsWith('/admin-alerts') ||
        req.nextUrl.pathname.startsWith('/alerts')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  // Verificar se é admin para rotas admin
  if (req.nextUrl.pathname.startsWith('/admin-alerts')) {
    const { data: user } = await supabase.auth.getUser()
    const isAdminUser = user?.user?.role === 'admin'

    if (!isAdminUser) {
      // Verificar na tabela user_roles
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (userRole?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }

  // Se está autenticado e tentando acessar login/signup
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin-alerts/:path*',
    '/alerts/:path*',
    '/login',
    '/signup'
  ]
} 