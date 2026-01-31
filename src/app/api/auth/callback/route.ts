import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Construct the redirect URL properly for production
      const forwardedHost = request.headers.get('x-forwarded-host');
      const forwardedProto = request.headers.get('x-forwarded-proto');
      
      let redirectUrl: string;
      
      if (forwardedHost) {
        // Production: use forwarded headers from Vercel
        const protocol = forwardedProto || 'https';
        redirectUrl = `${protocol}://${forwardedHost}${next}`;
      } else {
        // Development: use origin from request
        redirectUrl = `${requestUrl.origin}${next}`;
      }
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Return the user to an error page with instructions
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const errorUrl = forwardedHost 
    ? `${forwardedProto || 'https'}://${forwardedHost}/auth/auth-code-error`
    : `${requestUrl.origin}/auth/auth-code-error`;
  
  return NextResponse.redirect(errorUrl);
}
