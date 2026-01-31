import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Development-only route to create a test user session
 * This bypasses OAuth for local testing
 * 
 * DO NOT use in production!
 */
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const supabase = await createClient();

    // Create a test user profile directly (simulating OAuth callback)
    // First, let's check if we have any way to create a session
    
    // For now, we'll redirect to a page that lets us test the UI
    // without auth by using mock data
    
    return NextResponse.redirect(new URL('/dashboard?dev=true', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Dev login error:', error);
    return NextResponse.json({ error: 'Dev login failed' }, { status: 500 });
  }
}
