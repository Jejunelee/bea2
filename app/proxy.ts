import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for the proxy
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  // Create a new Supabase client for this request
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
  
  // Get the session from the request cookies
  const { data: { session } } = await supabase.auth.getSession();
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Skip middleware for API routes (they handle their own auth)
  if (isApiRoute) {
    return NextResponse.next();
  }

  // If trying to access admin routes without session, redirect to login
  if (isAdminRoute && !session && !isLoginPage) {
    const redirectUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If already logged in and trying to access login page, redirect to admin
  if (session && isLoginPage) {
    const redirectUrl = new URL('/admin', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}