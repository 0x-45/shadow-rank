import { NextResponse } from 'next/server';
import type { ResumeData } from '@/types';

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

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Check if Reducto API key is configured
    const reductoApiKey = process.env.REDUCTO_API_KEY;
    
    if (!reductoApiKey || reductoApiKey.includes('your_')) {
      // Fallback: Extract basic info and return mock data
      console.log('Reducto API key not configured, using mock parsing');
      
      const mockResumeData: ResumeData = {
        source: 'resume',
        raw_text: 'Resume uploaded but parsing not configured',
        skills: ['JavaScript', 'TypeScript', 'React'],
        experience: [],
        projects: [],
        education: [],
        languages: ['JavaScript', 'TypeScript'],
      };

      return NextResponse.json({ resume_data: mockResumeData });
    }

    // Call Reducto API for actual parsing
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const reductoResponse = await fetch('https://api.reducto.ai/parse', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${reductoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_url: `data:application/pdf;base64,${base64}`,
        options: {
          output_mode: 'markdown',
        },
      }),
    });

    if (!reductoResponse.ok) {
      console.error('Reducto API error:', await reductoResponse.text());
      throw new Error('Resume parsing failed');
    }

    const reductoData = await reductoResponse.json();
    
    // Extract resume data from Reducto response
    const resumeData: ResumeData = {
      source: 'resume',
      raw_text: reductoData.result?.text || '',
      skills: extractSkills(reductoData.result?.text || ''),
      experience: [],
      projects: [],
      education: [],
      languages: extractLanguages(reductoData.result?.text || ''),
    };

    return NextResponse.json({ resume_data: resumeData });

  } catch (error) {
    console.error('Parse resume error:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume. Please try again or use GitHub profile instead.' },
      { status: 500 }
    );
  }
}

// Helper function to extract skills from resume text
function extractSkills(text: string): string[] {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Next.js', 'Django', 'Flask',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
    'Git', 'Linux', 'Agile', 'Scrum',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
  ];

  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();

  for (const skill of skillKeywords) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

// Helper function to extract programming languages
function extractLanguages(text: string): string[] {
  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB',
  ];

  const foundLanguages: string[] = [];
  const lowerText = text.toLowerCase();

  for (const lang of languages) {
    if (lowerText.includes(lang.toLowerCase())) {
      foundLanguages.push(lang);
    }
  }

  return foundLanguages;
}
