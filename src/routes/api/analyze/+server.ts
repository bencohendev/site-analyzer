import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface TechSignature {
  name: string;
  category: 'frontend' | 'backend' | 'cms' | 'server' | 'analytics' | 'other';
  patterns: {
    type: 'script' | 'meta' | 'header' | 'html' | 'class' | 'attribute';
    pattern: string;
    description: string;
  }[];
}

const techSignatures: TechSignature[] = [
  // Frontend Frameworks
  { 
    name: 'React', 
    category: 'frontend', 
    patterns: [
      {
        type: 'script',
        pattern: 'react',
        description: 'React script detected in page source'
      },
      {
        type: 'class',
        pattern: 'data-reactroot',
        description: 'React root element found in DOM'
      }
    ]
  },
  { 
    name: 'Vue.js', 
    category: 'frontend', 
    patterns: [
      {
        type: 'script',
        pattern: 'vue',
        description: 'Vue.js script detected in page source'
      },
      {
        type: 'attribute',
        pattern: 'v-',
        description: 'Vue.js directive found in HTML'
      }
    ]
  },
  { 
    name: 'Angular', 
    category: 'frontend', 
    patterns: [
      { pattern: 'angular', confidence: 0.3, type: 'content' },
      { pattern: 'ng-', confidence: 0.8, type: 'attribute' },
      { pattern: 'ng-app', confidence: 0.9, type: 'attribute' }
    ]
  },
  { 
    name: 'Svelte', 
    category: 'frontend', 
    patterns: [
      { pattern: 'svelte', confidence: 0.3, type: 'content' },
      { pattern: 'svelte.js', confidence: 0.8, type: 'script' },
      { pattern: 'data-svelte', confidence: 0.9, type: 'attribute' }
    ]
  },
  
  // Backend Technologies
  { 
    name: 'Node.js', 
    category: 'backend', 
    patterns: [
      {
        type: 'header',
        pattern: 'x-powered-by: express',
        description: 'Express.js header indicates Node.js backend'
      }
    ]
  },
  { 
    name: 'PHP', 
    category: 'backend', 
    patterns: [
      {
        type: 'header',
        pattern: 'x-powered-by: php',
        description: 'PHP header detected in server response'
      },
      {
        type: 'html',
        pattern: '.php',
        description: 'PHP file extension found in URLs'
      }
    ]
  },
  
  // CMS
  { 
    name: 'WordPress', 
    category: 'cms', 
    patterns: [
      {
        type: 'meta',
        pattern: 'wp-',
        description: 'WordPress meta tags found'
      },
      {
        type: 'html',
        pattern: '/wp-content/',
        description: 'WordPress content directory referenced'
      },
      {
        type: 'html',
        pattern: '/wp-includes/',
        description: 'WordPress includes directory referenced'
      }
    ]
  },
  
  // Analytics & Marketing
  { 
    name: 'Google Analytics', 
    category: 'analytics', 
    patterns: [
      {
        type: 'script',
        pattern: 'google-analytics.com',
        description: 'Google Analytics script detected'
      },
      {
        type: 'script',
        pattern: 'gtag',
        description: 'Google Analytics gtag found'
      }
    ]
  },
  
  // Other
  { 
    name: 'jQuery', 
    category: 'frontend', 
    patterns: [
      { pattern: 'jquery', confidence: 0.3, type: 'content' },
      { pattern: 'jquery.js', confidence: 0.8, type: 'script' },
      { pattern: 'jQuery.', confidence: 0.9, type: 'content' }
    ]
  },
  { 
    name: 'Bootstrap', 
    category: 'frontend', 
    patterns: [
      { pattern: 'bootstrap', confidence: 0.3, type: 'content' },
      { pattern: 'bootstrap.css', confidence: 0.8, type: 'script' },
      { pattern: 'bootstrap.min.js', confidence: 0.8, type: 'script' }
    ]
  },
  { 
    name: 'Tailwind CSS', 
    category: 'frontend', 
    patterns: [
      { pattern: 'tailwind', confidence: 0.3, type: 'content' },
      { pattern: 'tailwindcss', confidence: 0.8, type: 'script' },
      { pattern: 'tailwind.config', confidence: 0.9, type: 'content' }
    ]
  },
  { 
    name: 'Python', 
    category: 'backend', 
    patterns: [
      { pattern: 'python', confidence: 0.3, type: 'content' },
      { pattern: 'django', confidence: 0.8, type: 'content' },
      { pattern: 'flask', confidence: 0.8, type: 'content' }
    ]
  },
  { 
    name: 'Ruby', 
    category: 'backend', 
    patterns: [
      { pattern: 'ruby', confidence: 0.3, type: 'content' },
      { pattern: 'rails', confidence: 0.8, type: 'content' },
      { pattern: 'rubygems', confidence: 0.7, type: 'content' }
    ]
  },
  { 
    name: '.NET', 
    category: 'backend', 
    patterns: [
      { pattern: 'asp.net', confidence: 0.3, type: 'content' },
      { pattern: 'dotnet', confidence: 0.8, type: 'content' },
      { pattern: 'X-AspNet-Version', confidence: 0.9, type: 'header' }
    ]
  },
  { 
    name: 'Drupal', 
    category: 'cms', 
    patterns: [
      { pattern: 'drupal', confidence: 0.3, type: 'content' },
      { pattern: 'Drupal.settings', confidence: 0.9, type: 'content' },
      { pattern: 'drupal.js', confidence: 0.8, type: 'script' }
    ]
  },
  { 
    name: 'Joomla', 
    category: 'cms', 
    patterns: [
      { pattern: 'joomla', confidence: 0.3, type: 'content' },
      { pattern: 'joomla.js', confidence: 0.8, type: 'script' },
      { pattern: 'joomla!', confidence: 0.9, type: 'meta' }
    ]
  },
  { 
    name: 'Shopify', 
    category: 'cms', 
    patterns: [
      { pattern: 'shopify', confidence: 0.3, type: 'content' },
      { pattern: 'shopify.com', confidence: 0.8, type: 'content' },
      { pattern: 'shopify.assets', confidence: 0.9, type: 'content' }
    ]
  },
  { 
    name: 'Nginx', 
    category: 'server', 
    patterns: [
      {
        type: 'header',
        pattern: 'server: nginx',
        description: 'Nginx server header detected'
      }
    ]
  },
  { 
    name: 'Google Tag Manager', 
    category: 'analytics', 
    patterns: [
      { pattern: 'gtm', confidence: 0.3, type: 'content' },
      { pattern: 'googletagmanager', confidence: 0.9, type: 'script' },
      { pattern: 'GTM-', confidence: 0.9, type: 'content' }
    ]
  },
  { 
    name: 'Facebook Pixel', 
    category: 'analytics', 
    patterns: [
      { pattern: 'facebook', confidence: 0.3, type: 'content' },
      { pattern: 'fbq', confidence: 0.9, type: 'script' },
      { pattern: 'connect.facebook.net', confidence: 0.9, type: 'script' }
    ]
  },
  { 
    name: 'TypeScript', 
    category: 'other', 
    patterns: [
      { pattern: 'typescript', confidence: 0.3, type: 'content' },
      { pattern: '.ts', confidence: 0.8, type: 'content' },
      { pattern: 'tsconfig.json', confidence: 0.9, type: 'content' }
    ]
  },
  { 
    name: 'GraphQL', 
    category: 'other', 
    patterns: [
      { pattern: 'graphql', confidence: 0.3, type: 'content' },
      { pattern: 'graphql.js', confidence: 0.8, type: 'script' },
      { pattern: 'graphql-', confidence: 0.7, type: 'content' }
    ]
  },
  { 
    name: 'Webpack', 
    category: 'other', 
    patterns: [
      { pattern: 'webpack', confidence: 0.3, type: 'content' },
      { pattern: 'webpack.js', confidence: 0.8, type: 'script' },
      { pattern: 'webpack.config', confidence: 0.9, type: 'content' }
    ]
  },
  { 
    name: 'Vite', 
    category: 'other', 
    patterns: [
      { pattern: 'vite', confidence: 0.3, type: 'content' },
      { pattern: 'vite.js', confidence: 0.8, type: 'script' },
      { pattern: 'vite.config', confidence: 0.9, type: 'content' }
    ]
  },
  {
    name: 'Apache',
    category: 'server',
    patterns: [
      {
        type: 'header',
        pattern: 'server: apache',
        description: 'Apache server header detected'
      }
    ]
  }
];

interface DetectedTech {
  name: string;
  category: string;
  confidence: number;
  evidence: { type: string; description: string; match: string }[];
}

function detectTechnologies(html: string, headers: Record<string, string>): DetectedTech[] {
  const detected: DetectedTech[] = [];
  const headerString = Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
    .toLowerCase();

  techSignatures.forEach(tech => {
    let confidence = 0;
    const evidence: { type: string; description: string; match: string }[] = [];

    tech.patterns.forEach(pattern => {
      if (pattern.type === 'header') {
        if (headerString.includes(pattern.pattern.toLowerCase())) {
          confidence += 1;
          evidence.push({
            type: 'Server Header',
            description: pattern.description,
            match: pattern.pattern
          });
        }
      } else {
        const regex = new RegExp(pattern.pattern, 'i');
        if (regex.test(html)) {
          confidence += 1;
          evidence.push({
            type: pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1),
            description: pattern.description,
            match: pattern.pattern
          });
        }
      }
    });

    if (confidence > 0) {
      detected.push({
        name: tech.name,
        category: tech.category,
        confidence: (confidence / tech.patterns.length) * 100,
        evidence
      });
    }
  });

  return detected;
}

export const POST: RequestHandler = async ({ request }) => {
  const { url } = await request.json();

  try {
    const response = await fetch(url);
    const html = await response.text();
    const headers = response.headers;

    // Detect technologies
    const technologies = detectTechnologies(html, headers);

    // Basic structure analysis using regex
    const structure = {
      title: 'Page Structure',
      items: [
        { name: 'HTML Version', value: html.includes('<!DOCTYPE html>') ? 'HTML5' : 'Unknown' },
        { name: 'Meta Tags', value: (html.match(/<meta[^>]*>/g) || []).length },
        { name: 'Images', value: (html.match(/<img[^>]*>/g) || []).length },
        { name: 'Links', value: (html.match(/<a[^>]*>/g) || []).length }
      ]
    };

    // Performance metrics
    const performance = {
      title: 'Performance',
      items: [
        { name: 'Page Size', value: `${(html.length / 1024).toFixed(1)}KB` },
        { name: 'Scripts', value: (html.match(/<script[^>]*>/g) || []).length },
        { name: 'Stylesheets', value: (html.match(/<link[^>]*>/g) || []).length }
      ]
    };

    // SEO analysis
    const seo = {
      title: 'SEO Analysis',
      items: [
        { 
          name: 'Meta Description', 
          value: html.includes('<meta name="description"') ? 'Present' : 'Missing' 
        },
        { 
          name: 'Title Length', 
          value: (() => {
            const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
            const titleLength = titleMatch ? titleMatch[1].length : 0;
            return titleLength > 10 && titleLength < 60 ? 'Good' : 'Needs improvement';
          })()
        },
        { 
          name: 'Heading Structure', 
          value: html.includes('<h1') ? 'Good' : 'Missing H1' 
        }
      ]
    };

    // Accessibility analysis
    const images = html.match(/<img[^>]*>/g) || [];
    const imagesWithAlt = images.filter(img => img.includes('alt=')).length;
    
    const accessibility = {
      title: 'Accessibility',
      items: [
        { 
          name: 'Alt Tags', 
          value: images.length > 0 ? `${Math.round((imagesWithAlt / images.length) * 100)}%` : 'No images' 
        },
        { 
          name: 'ARIA Labels', 
          value: html.includes('aria-label=') ? 'Present' : 'Missing' 
        },
        { 
          name: 'Form Labels', 
          value: html.includes('<label') ? 'Present' : 'Missing' 
        }
      ]
    };

    // Technology stack with confidence scores
    const techStack = {
      title: 'Technology Stack',
      items: [
        {
          name: 'Frontend',
          value: technologies.filter(t => t.category === 'frontend').length > 0 
            ? technologies.filter(t => t.category === 'frontend')
                .map(tech => `${tech.name} (${Math.round(tech.confidence)}% confidence)`)
                .join(', ')
            : 'Not detected',
          technologies: technologies.filter(t => t.category === 'frontend')
            .map(tech => ({
              name: tech.name,
              confidence: tech.confidence,
              evidence: tech.evidence
            }))
        },
        {
          name: 'Backend',
          value: technologies.filter(t => t.category === 'backend').length > 0 
            ? technologies.filter(t => t.category === 'backend')
                .map(tech => `${tech.name} (${Math.round(tech.confidence)}% confidence)`)
                .join(', ')
            : 'Not detected',
          technologies: technologies.filter(t => t.category === 'backend')
            .map(tech => ({
              name: tech.name,
              confidence: tech.confidence,
              evidence: tech.evidence
            }))
        },
        {
          name: 'CMS',
          value: technologies.filter(t => t.category === 'cms').length > 0 
            ? technologies.filter(t => t.category === 'cms')
                .map(tech => `${tech.name} (${Math.round(tech.confidence)}% confidence)`)
                .join(', ')
            : 'Not detected',
          technologies: technologies.filter(t => t.category === 'cms')
            .map(tech => ({
              name: tech.name,
              confidence: tech.confidence,
              evidence: tech.evidence
            }))
        },
        {
          name: 'Server',
          value: technologies.filter(t => t.category === 'server').length > 0 
            ? technologies.filter(t => t.category === 'server')
                .map(tech => `${tech.name} (${Math.round(tech.confidence)}% confidence)`)
                .join(', ')
            : 'Not detected',
          technologies: technologies.filter(t => t.category === 'server')
            .map(tech => ({
              name: tech.name,
              confidence: tech.confidence,
              evidence: tech.evidence
            }))
        },
        {
          name: 'Analytics',
          value: technologies.filter(t => t.category === 'analytics').length > 0 
            ? technologies.filter(t => t.category === 'analytics')
                .map(tech => `${tech.name} (${Math.round(tech.confidence)}% confidence)`)
                .join(', ')
            : 'Not detected',
          technologies: technologies.filter(t => t.category === 'analytics')
            .map(tech => ({
              name: tech.name,
              confidence: tech.confidence,
              evidence: tech.evidence
            }))
        },
        {
          name: 'Other',
          value: technologies.filter(t => t.category === 'other').length > 0 
            ? technologies.filter(t => t.category === 'other')
                .map(tech => `${tech.name} (${Math.round(tech.confidence)}% confidence)`)
                .join(', ')
            : 'Not detected',
          technologies: technologies.filter(t => t.category === 'other')
            .map(tech => ({
              name: tech.name,
              confidence: tech.confidence,
              evidence: tech.evidence
            }))
        }
      ]
    };

    return json({
      url,
      structure,
      performance,
      seo,
      accessibility,
      techStack
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return json({ error: 'Failed to analyze website' }, { status: 500 });
  }
}; 