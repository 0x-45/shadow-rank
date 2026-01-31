import { NextResponse } from 'next/server';
import type { ResumeData } from '@/types';
import { parseResumeData, parseResumeForSkills, mergeSkillsWithEarnedXp } from '@/lib/resume/parser';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Accept more file types
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Supported file types: PDF, TXT, MD, DOC, DOCX' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();
    
    // Parse resume data using our parser (currently returns placeholder)
    const resumeData = parseResumeData(fileContent, 'resume');
    const parsedSkills = parseResumeForSkills(fileContent, file.type);

    // Try to store skills in database if user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Get existing skills to preserve earned_xp
      const { data: existingSkills } = await supabase
        .from('skills')
        .select('skill_name, earned_xp, base_level')
        .eq('user_id', user.id);

      // Merge new skills with existing earned XP
      const mergedSkills = mergeSkillsWithEarnedXp(
        parsedSkills,
        existingSkills || []
      );

      // Upsert skills (update if exists, insert if not)
      for (const skill of mergedSkills) {
        await supabase
          .from('skills')
          .upsert({
            user_id: user.id,
            skill_name: skill.skill_name,
            base_level: skill.base_level,
            earned_xp: skill.earned_xp,
            level: skill.level,
          }, {
            onConflict: 'user_id,skill_name',
          });
      }

      // Update profile with resume data
      await supabase
        .from('profiles')
        .update({
          resume_data: resumeData,
        })
        .eq('id', user.id);
    }

    return NextResponse.json({ 
      resume_data: resumeData,
      skills: parsedSkills,
    });

  } catch (error) {
    console.error('Parse resume error:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume. Please try again or use GitHub profile instead.' },
      { status: 500 }
    );
  }
}
