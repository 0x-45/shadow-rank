import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/goal - Save user's career goal
 * GET /api/goal - Fetch current goal
 * DELETE /api/goal - Remove goal
 */

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { goal } = body;

    if (!goal || typeof goal !== 'string') {
      return NextResponse.json(
        { error: 'Goal is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate goal length
    if (goal.length > 500) {
      return NextResponse.json(
        { error: 'Goal must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Update profile with goal
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({ 
        goal: goal.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to save goal:', updateError);
      return NextResponse.json(
        { error: 'Failed to save goal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      goal: profile.goal,
    });

  } catch (error) {
    console.error('Save goal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile with goal
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('goal')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error('Failed to fetch goal:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch goal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      goal: profile?.goal || null,
    });

  } catch (error) {
    console.error('Fetch goal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Remove goal from profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        goal: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to delete goal:', updateError);
      return NextResponse.json(
        { error: 'Failed to delete goal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Goal removed successfully',
    });

  } catch (error) {
    console.error('Delete goal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
