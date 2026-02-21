import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;
  
  // Check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Frontend me wallet check hoga, yahan basic check
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};