import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchGitHubProfile } from '@/lib/utils/github';
import {
  AWAKENING_SYSTEM_PROMPT,
  generateAwakeningPrompt,
  parseAIResponse,
  getFallbackAwakeningResult,
} from '@/lib/ai/prompts';
import type { ResumeData, AwakeningResult } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let resumeData: ResumeData;

    // Handle GitHub fallback
    if (body.github_username) {
      const githubData = await fetchGitHubProfile(body.github_username);
      if (!githubData) {
        return NextResponse.json(
          { error: 'Failed to fetch GitHub profile' },
          { status: 400 }
        );
      }
      resumeData = githubData;
    } else if (body.resume_data) {
      resumeData = body.resume_data;
    } else {
      return NextResponse.json(
        { error: 'No resume data or GitHub username provided' },
        { status: 400 }
      );
    }

    // Generate awakening result using AI
    let awakeningResult: AwakeningResult;
    
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (openaiKey && !openaiKey.includes('your_')) {
      // Use OpenAI
      awakeningResult = await callOpenAI(resumeData, openaiKey);
    } else if (groqKey && !groqKey.includes('your_')) {
      // Use Groq
      awakeningResult = await callGroq(resumeData, groqKey);
    } else {
      // Use fallback
      console.log('No AI API key configured, using fallback awakening');
      awakeningResult = getFallbackAwakeningResult();
    }

    // Save to Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        github_id: user.user_metadata?.user_name || null,
        username: user.user_metadata?.user_name || user.user_metadata?.name || 'Hunter',
        avatar_url: user.user_metadata?.avatar_url || null,
        rank: awakeningResult.rank,
        xp: 0,
        current_quest: awakeningResult.quest,
        resume_data: resumeData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile save error:', profileError);
      throw new Error('Failed to save profile');
    }

    // Initialize debugging skill if not exists
    await supabase
      .from('skills')
      .upsert({
        user_id: user.id,
        skill_name: 'Debugging',
        level: 1,
        xp: 0,
      }, {
        onConflict: 'user_id,skill_name',
      });

    return NextResponse.json({
      awakening: awakeningResult,
      profile,
    });

  } catch (error) {
    console.error('Awaken error:', error);
    return NextResponse.json(
      { error: 'Awakening process failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function callOpenAI(resumeData: ResumeData, apiKey: string): Promise<AwakeningResult> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: AWAKENING_SYSTEM_PROMPT },
          { role: 'user', content: generateAwakeningPrompt(resumeData) },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = parseAIResponse<AwakeningResult>(content);
    if (!parsed) {
      throw new Error('Failed to parse OpenAI response');
    }

    return parsed;
  } catch (error) {
    console.error('OpenAI error:', error);
    return getFallbackAwakeningResult();
  }
}

async function callGroq(resumeData: ResumeData, apiKey: string): Promise<AwakeningResult> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: AWAKENING_SYSTEM_PROMPT },
          { role: 'user', content: generateAwakeningPrompt(resumeData) },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Groq API error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from Groq');
    }

    const parsed = parseAIResponse<AwakeningResult>(content);
    if (!parsed) {
      throw new Error('Failed to parse Groq response');
    }

    return parsed;
  } catch (error) {
    console.error('Groq error:', error);
    return getFallbackAwakeningResult();
  }
}
