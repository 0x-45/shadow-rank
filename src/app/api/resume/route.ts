import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Resume API - Handles resume file upload and retrieval from Supabase Storage
 * 
 * POST: Upload a resume file to Supabase storage
 * GET: Get the resume URL for the current user
 */

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/resume - Upload a resume file
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type. Allowed types: PDF, TXT, MD, DOC, DOCX` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    
    // Create file path: {user_id}/resume.{extension}
    const filePath = `${user.id}/resume.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase storage (will overwrite if exists)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      console.error('Resume upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload resume' },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    const resumeUrl = urlData?.publicUrl || null;
    const uploadedAt = new Date().toISOString();

    // Update user profile with resume URL and timestamp
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        resume_url: resumeUrl,
        resume_uploaded_at: uploadedAt,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      // Don't fail the request, file was uploaded successfully
    }

    return NextResponse.json({
      success: true,
      data: {
        path: uploadData.path,
        url: resumeUrl,
        uploaded_at: uploadedAt,
        filename: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/resume - Get the current user's resume URL
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get profile with resume info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('resume_url, resume_uploaded_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        resume_url: profile?.resume_url || null,
        resume_uploaded_at: profile?.resume_uploaded_at || null,
        has_resume: !!profile?.resume_url,
      },
    });
  } catch (error) {
    console.error('Resume fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resume - Delete the current user's resume
 */
export async function DELETE() {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // List files in user's folder to find the resume
    const { data: files, error: listError } = await supabase.storage
      .from('resumes')
      .list(user.id);

    if (listError) {
      console.error('List files error:', listError);
      return NextResponse.json(
        { success: false, error: 'Failed to find resume' },
        { status: 500 }
      );
    }

    // Delete all files in the user's folder
    if (files && files.length > 0) {
      const filePaths = files.map(f => `${user.id}/${f.name}`);
      const { error: deleteError } = await supabase.storage
        .from('resumes')
        .remove(filePaths);

      if (deleteError) {
        console.error('Delete files error:', deleteError);
        return NextResponse.json(
          { success: false, error: 'Failed to delete resume' },
          { status: 500 }
        );
      }
    }

    // Update profile to remove resume URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        resume_url: null,
        resume_uploaded_at: null,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Resume delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
