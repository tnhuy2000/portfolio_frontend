export const siteConfig = {
  name: 'Nhu Y Truong | Full-stack Developer',
  description: 'Portfolio of Nhu Y Truong, a Full-stack Developer specializing in React.js, Next.js, and Node.js/NestJS. Showcasing projects, experience, and technical skills',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/images/og.jpg',
  links: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
} as const;
