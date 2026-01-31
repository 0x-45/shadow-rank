import type { GitHubRepo, ResumeData } from '@/types';

/**
 * Parse a GitHub repository URL and extract owner and repo name
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\?#]+)/,
    /^([^\/]+)\/([^\/]+)$/,  // owner/repo format
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
      };
    }
  }

  return null;
}

/**
 * Fetch repository information from GitHub API (no auth needed for public repos)
 */
export async function fetchGitHubRepo(owner: string, repo: string): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      name: data.name,
      full_name: data.full_name,
      description: data.description || '',
      html_url: data.html_url,
      pushed_at: data.pushed_at,
      created_at: data.created_at,
      language: data.language || 'Unknown',
      stargazers_count: data.stargazers_count,
      is_valid: true,
    };
  } catch (error) {
    console.error('Failed to fetch GitHub repo:', error);
    return null;
  }
}

/**
 * Verify a GitHub repository URL
 */
export async function verifyGitHubRepo(url: string): Promise<{
  valid: boolean;
  repo?: GitHubRepo;
  error?: string;
}> {
  const parsed = parseGitHubUrl(url);

  if (!parsed) {
    return {
      valid: false,
      error: 'Invalid GitHub URL format. Please use: https://github.com/owner/repo',
    };
  }

  const repo = await fetchGitHubRepo(parsed.owner, parsed.repo);

  if (!repo) {
    return {
      valid: false,
      error: 'Repository not found or is private. Please submit a public repository.',
    };
  }

  return {
    valid: true,
    repo,
  };
}

/**
 * Fetch user's GitHub profile and repositories (for fallback awakening)
 */
export async function fetchGitHubProfile(username: string): Promise<ResumeData | null> {
  try {
    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!userResponse.ok) return null;
    const userData = await userResponse.json();

    // Fetch user's repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    const repos = reposResponse.ok ? await reposResponse.json() : [];

    // Extract languages from repos
    const languages = [...new Set(repos.map((r: { language: string }) => r.language).filter(Boolean))] as string[];

    // Build resume data from GitHub profile
    return {
      source: 'github',
      skills: languages,
      experience: userData.company
        ? [
            {
              title: 'Developer',
              company: userData.company,
              duration: 'Current',
              description: userData.bio || '',
            },
          ]
        : [],
      projects: repos.slice(0, 5).map((r: {
        name: string;
        description: string;
        language: string;
        html_url: string;
      }) => ({
        name: r.name,
        description: r.description || '',
        technologies: [r.language].filter(Boolean),
        url: r.html_url,
      })),
      education: [],
      languages,
    };
  } catch (error) {
    console.error('Failed to fetch GitHub profile:', error);
    return null;
  }
}
