/**
 * Placeholder resume data for development and demo purposes
 * This simulates what a real resume parser would extract from an uploaded resume
 */

export const PLACEHOLDER_RESUME_MARKDOWN = `
# Alex Chen
**Full Stack Developer**

## Contact
- Email: alex.chen@email.com
- GitHub: github.com/alexchen-dev
- Location: San Francisco, CA

## Summary
Passionate full stack developer with 4+ years of experience building scalable web applications. 
Strong expertise in React, Node.js, and cloud infrastructure. Proven track record of delivering 
high-quality code and mentoring junior developers.

## Skills

### Frontend Development
- **React/Next.js**: 4 years experience, built 10+ production applications
- **TypeScript**: 3 years, strong typing advocate
- **Tailwind CSS**: 2 years, component library development
- **Testing**: Jest, React Testing Library, Cypress

### Backend Development
- **Node.js/Express**: 4 years, REST and GraphQL APIs
- **Python/FastAPI**: 2 years, microservices
- **Database Design**: PostgreSQL, MongoDB, Redis
- **API Design**: RESTful, GraphQL, gRPC

### DevOps & Infrastructure
- **AWS**: EC2, S3, Lambda, RDS, CloudFront
- **Docker**: Containerization, docker-compose
- **CI/CD**: GitHub Actions, Jenkins
- **Monitoring**: Datadog, CloudWatch

### Testing & Quality
- **Unit Testing**: Jest, Pytest
- **Integration Testing**: Supertest, Cypress
- **Code Review**: Mentored 5+ junior developers
- **TDD**: Test-driven development practices

### Database
- **PostgreSQL**: Advanced queries, optimization
- **MongoDB**: Schema design, aggregations
- **Redis**: Caching strategies
- **Database migrations**: Prisma, Knex

### Debugging & Problem Solving
- **Chrome DevTools**: Performance profiling
- **Node.js debugging**: Inspector, VS Code
- **Log analysis**: ELK stack, structured logging
- **Root cause analysis**: Production incident response

## Experience

### Senior Full Stack Developer | TechCorp Inc.
**Jan 2022 - Present** | San Francisco, CA
- Led development of customer-facing dashboard serving 100K+ users
- Reduced page load time by 60% through code splitting and caching
- Mentored team of 3 junior developers
- Implemented CI/CD pipeline reducing deployment time by 80%

### Full Stack Developer | StartupXYZ
**Jun 2020 - Dec 2021** | Remote
- Built real-time collaboration features using WebSockets
- Designed and implemented RESTful API for mobile app
- Migrated monolith to microservices architecture
- Improved test coverage from 40% to 85%

### Junior Developer | WebAgency
**Jun 2019 - May 2020** | New York, NY
- Developed responsive web applications for clients
- Collaborated with design team on UI/UX improvements
- Fixed 200+ bugs in legacy codebase
- Learned best practices in code review

## Education

### B.S. Computer Science | University of California, Berkeley
**2015 - 2019** | GPA: 3.7/4.0
- Relevant coursework: Data Structures, Algorithms, Databases, Web Development
- Senior project: Real-time collaborative coding platform

## Certifications
- AWS Certified Solutions Architect - Associate (2023)
- Node.js Certified Developer (2022)
`;

/**
 * Skill proficiency levels extracted from the placeholder resume
 * These are realistic levels based on the experience described
 */
export interface PlaceholderSkill {
  name: string;
  level: number; // 1-10 scale
  confidence: number; // 0-1, how confident we are in this assessment
  evidence: string; // What in the resume supports this level
}

export const PLACEHOLDER_SKILLS: PlaceholderSkill[] = [
  {
    name: 'Frontend',
    level: 8,
    confidence: 0.9,
    evidence: '4 years React experience, 10+ production apps, TypeScript advocate',
  },
  {
    name: 'Backend',
    level: 7,
    confidence: 0.85,
    evidence: '4 years Node.js, REST/GraphQL APIs, microservices experience',
  },
  {
    name: 'Debugging',
    level: 6,
    confidence: 0.8,
    evidence: 'Chrome DevTools profiling, Node.js debugging, incident response',
  },
  {
    name: 'DevOps',
    level: 6,
    confidence: 0.75,
    evidence: 'AWS services, Docker, CI/CD with GitHub Actions',
  },
  {
    name: 'Testing',
    level: 7,
    confidence: 0.85,
    evidence: 'Jest, Cypress, TDD practices, improved coverage from 40% to 85%',
  },
  {
    name: 'Database',
    level: 7,
    confidence: 0.8,
    evidence: 'PostgreSQL, MongoDB, Redis, schema design, migrations',
  },
  {
    name: 'System Design',
    level: 5,
    confidence: 0.7,
    evidence: 'Microservices migration, API design, but limited explicit architecture experience',
  },
];

/**
 * Get the placeholder skills data
 */
export function getPlaceholderSkills(): PlaceholderSkill[] {
  return PLACEHOLDER_SKILLS;
}

/**
 * Get the placeholder resume markdown
 */
export function getPlaceholderResumeMarkdown(): string {
  return PLACEHOLDER_RESUME_MARKDOWN;
}
