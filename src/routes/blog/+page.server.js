// Sample blog posts - in a real app, this would come from a database or CMS
const allPosts = [
    {
        slug: 'getting-started-with-sveltekit',
        title: 'Getting Started with SvelteKit',
        excerpt: 'Learn how to build modern web applications with SvelteKit, the full-stack framework for Svelte. We\'ll cover setup, routing, and deployment.',
        content: `
# Getting Started with SvelteKit

SvelteKit is a powerful framework for building modern web applications...

## Why SvelteKit?

SvelteKit offers several advantages over traditional frameworks:

- **Performance**: Svelte compiles to vanilla JavaScript
- **Simplicity**: Less boilerplate code
- **Full-stack**: Built-in routing and server-side rendering

## Getting Started

To create a new SvelteKit project:

\`\`\`bash
npm create sveltekit@latest my-app
cd my-app
npm install
npm run dev
\`\`\`

This will create a new SvelteKit project and start the development server.

## Conclusion

SvelteKit is an excellent choice for modern web development...
        `,
        date: '2025-01-15',
        author: 'Your Team',
        tags: ['SvelteKit', 'JavaScript', 'Web Development']
    },
    {
        slug: 'email-marketing-best-practices',
        title: 'Email Marketing Best Practices for 2025',
        excerpt: 'Discover the latest strategies and techniques to make your email campaigns more effective and engaging for your audience.',
        content: `
# Email Marketing Best Practices for 2025

Email marketing continues to be one of the most effective digital marketing channels...

## Key Strategies

### 1. Personalization
- Use subscriber names
- Segment your audience
- Send targeted content

### 2. Mobile Optimization
- Responsive design
- Short subject lines
- Clear CTAs

### 3. Automation
- Welcome sequences
- Behavioral triggers
- Abandoned cart emails

## Conclusion

By following these best practices, you can significantly improve your email marketing results.
        `,
        date: '2025-01-10',
        author: 'Your Team',
        tags: ['Email Marketing', 'Digital Marketing', 'Best Practices']
    },
    {
        slug: 'modern-web-development-trends',
        title: 'Modern Web Development Trends',
        excerpt: 'Explore the cutting-edge technologies and methodologies shaping web development today, from JAMstack to serverless functions.',
        content: `
# Modern Web Development Trends

The web development landscape is constantly evolving...

## Current Trends

### JAMstack Architecture
- JavaScript, APIs, and Markup
- Better performance and security
- Easier scaling

### Serverless Functions
- Event-driven computing
- Cost-effective scaling
- Reduced server management

### Progressive Web Apps
- Native app experience
- Offline functionality
- Push notifications

## The Future

Looking ahead, we can expect to see more emphasis on performance, accessibility, and user experience.
        `,
        date: '2025-01-05',
        author: 'Your Team',
        tags: ['Web Development', 'JAMstack', 'Serverless', 'PWA']
    },
    {
        slug: 'building-responsive-websites',
        title: 'Building Responsive Websites in 2025',
        excerpt: 'Learn the essential techniques for creating websites that work perfectly across all devices and screen sizes.',
        content: `
# Building Responsive Websites in 2025

Creating websites that work seamlessly across all devices is more important than ever...

## Key Principles

### Mobile-First Design
- Start with mobile layouts
- Progressive enhancement
- Touch-friendly interfaces

### Flexible Grid Systems
- CSS Grid and Flexbox
- Fluid layouts
- Breakpoint strategies

### Performance Optimization
- Image optimization
- Lazy loading
- Critical CSS

## Tools and Techniques

Modern CSS features like Container Queries and CSS Grid make responsive design more powerful than ever.

## Conclusion

Responsive design is no longer optional—it's essential for modern web development.
        `,
        date: '2024-12-28',
        author: 'Your Team',
        tags: ['Responsive Design', 'CSS', 'Mobile-First', 'UX']
    },
    {
        slug: 'cloudflare-workers-guide',
        title: 'Deploying with Cloudflare Workers',
        excerpt: 'A comprehensive guide to deploying modern web applications using Cloudflare Workers for global edge computing.',
        content: `
# Deploying with Cloudflare Workers

Cloudflare Workers provide a powerful platform for edge computing...

## What are Workers?

Workers run JavaScript code at Cloudflare's edge locations worldwide, providing:

- Low latency
- Global distribution
- Serverless execution
- Cost-effective scaling

## Getting Started

### Installation
\`\`\`bash
npm install -g wrangler
wrangler login
\`\`\`

### Configuration
Create a \`wrangler.toml\` file with your project settings.

### Deployment
\`\`\`bash
wrangler publish
\`\`\`

## Best Practices

- Keep code lightweight
- Use KV storage for persistence
- Implement proper error handling

## Conclusion

Cloudflare Workers offer an excellent platform for modern web applications with global reach.
        `,
        date: '2024-12-20',
        author: 'Your Team',
        tags: ['Cloudflare', 'Edge Computing', 'Deployment', 'Serverless']
    }
];

const POSTS_PER_PAGE = 6;

export async function load({ url }) {
    const page = parseInt(url.searchParams.get('page') || '1');
    const offset = (page - 1) * POSTS_PER_PAGE;
    
    // Sort posts by date (newest first)
    const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get posts for current page
    const posts = sortedPosts.slice(offset, offset + POSTS_PER_PAGE);
    
    // Calculate pagination info
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    
    return {
        posts,
        pagination: {
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}
