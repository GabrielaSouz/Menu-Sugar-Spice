import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se estiver tentando acessar rotas admin
  if (pathname.startsWith('/admin')) {
    // Verifica se tem o cookie de autenticação
    const token = request.cookies.get('sb-access-token')
    
    if (!token) {
      // Redireciona para login se não estiver autenticado
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Se estiver na página de login e já estiver autenticado
  if (pathname === '/login') {
    const token = request.cookies.get('sb-access-token')
    
    if (token) {
      // Redireciona para dashboard se já estiver autenticado
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}
