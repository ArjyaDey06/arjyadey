// Map of exact official vector icons for all 36 technologies + auto-normalizer

const directIconMap: Record<string, string> = {
  // Languages
  'python': 'https://cdn.simpleicons.org/python',
  'typescript': 'https://cdn.simpleicons.org/typescript',
  'javascript': 'https://cdn.simpleicons.org/javascript',
  'c': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',

  // Frontend
  'react.js': 'https://cdn.simpleicons.org/react',
  'react': 'https://cdn.simpleicons.org/react',
  'next.js': 'https://cdn.simpleicons.org/nextdotjs/white',
  'nextjs': 'https://cdn.simpleicons.org/nextdotjs/white',
  'tailwind css': 'https://cdn.simpleicons.org/tailwindcss',
  'tailwindcss': 'https://cdn.simpleicons.org/tailwindcss',
  'framer motion': 'https://cdn.simpleicons.org/framer',
  'framermotion': 'https://cdn.simpleicons.org/framer',

  // Backend & APIs
  'node.js': 'https://cdn.simpleicons.org/nodedotjs',
  'nodejs': 'https://cdn.simpleicons.org/nodedotjs',
  'express.js': 'https://cdn.simpleicons.org/express/white',
  'express': 'https://cdn.simpleicons.org/express/white',
  'fast api': 'https://cdn.simpleicons.org/fastapi',
  'fastapi': 'https://cdn.simpleicons.org/fastapi',
  'django': 'https://cdn.simpleicons.org/django',
  'flask': 'https://cdn.simpleicons.org/flask/white',
  'rest api': 'https://cdn.simpleicons.org/postman',
  'restapi': 'https://cdn.simpleicons.org/postman',
  'graphql': 'https://cdn.simpleicons.org/graphql',
  'axios': 'https://cdn.simpleicons.org/axios',

  // Databases & Storage
  'postgresql': 'https://cdn.simpleicons.org/postgresql',
  'postgres': 'https://cdn.simpleicons.org/postgresql',
  'mysql': 'https://cdn.simpleicons.org/mysql',
  'mongodb': 'https://cdn.simpleicons.org/mongodb',
  'supabase': 'https://cdn.simpleicons.org/supabase',
  'firebase': 'https://cdn.simpleicons.org/firebase',
  'neo4j': 'https://cdn.simpleicons.org/neo4j',
  'qdrant': 'https://cdn.simpleicons.org/qdrant',

  // AI & Machine Learning
  'langchain': 'https://cdn.simpleicons.org/langchain',

  // DevOps & Cloud
  'docker': 'https://cdn.simpleicons.org/docker',
  'vercel': 'https://cdn.simpleicons.org/vercel/white',
  'git': 'https://cdn.simpleicons.org/git',
  'github': 'https://cdn.simpleicons.org/github/white',
  'github actions': 'https://cdn.simpleicons.org/githubactions',
  'githubactions': 'https://cdn.simpleicons.org/githubactions',

  // Workflow & Automation
  'n8n': 'https://cdn.simpleicons.org/n8n',
};

export function getTechIcon(name: string, customIcon?: string | null): string {
  if (customIcon && customIcon.trim().length > 0) {
    return customIcon;
  }

  const normalized = name.toLowerCase().trim();
  if (directIconMap[normalized]) {
    return directIconMap[normalized];
  }

  const slug = normalized.replace(/[^a-z0-9]/g, '');
  if (directIconMap[slug]) {
    return directIconMap[slug];
  }

  // Fallback to SimpleIcons dynamic CDN
  return `https://cdn.simpleicons.org/${slug}`;
}
