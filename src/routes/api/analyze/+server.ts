import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface TechSignature {
  name: string;
  category: 'frontend' | 'backend' | 'cms' | 'server' | 'analytics' | 'other';
  patterns: {
    pattern: string;
    confidence: number;
    type: 'script' | 'meta' | 'class' | 'id' | 'attribute' | 'header' | 'content';
  }[];
}

const techSignatures: TechSignature[] = [
  // Frontend Frameworks
  { 
    name: 'React', 
    category: 'frontend', 
    patterns: [
      { pattern: 'react', confidence: 0.3, type: 'content' },
      { pattern: 'react-dom', confidence: 0.8, type: 'script' },
      { pattern: 'data-reactroot', confidence: 0.9, type: 'attribute' },
      { pattern: 'ReactDOM.render', confidence: 0.9, type: 'content' }
    ]
  },
  { 
    name: 'Vue.js', 
    category: 'frontend', 
    patterns: [
      { pattern: 'vue', confidence: 0.3, type: 'content' },
      { pattern: 'vue.js', confidence: 0.8, type: 'script' },
      { pattern: 'v-bind', confidence: 0.9, type: 'attribute' },
      { pattern: 'v-for', confidence: 0.9, type: 'attribute' }
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
      { pattern: 'node', confidence: 0.3, type: 'content' },
      { pattern: 'express', confidence: 0.7, type: 'content' },
      { pattern: 'next.js', confidence: 0.9, type: 'script' }
    ]
  },
  { 
    name: 'PHP', 
    category: 'backend', 
    patterns: [
      { pattern: 'php', confidence: 0.3, type: 'content' },
      { pattern: '.php', confidence: 0.8, type: 'content' },
      { pattern: 'X-Powered-By', confidence: 0.9, type: 'header' }
    ]
  },
  
  // CMS
  { 
    name: 'WordPress', 
    category: 'cms', 
    patterns: [
      { pattern: 'wp-', confidence: 0.3, type: 'content' },
      { pattern: 'wordpress', confidence: 0.5, type: 'content' },
      { pattern: 'wp-content', confidence: 0.8, type: 'content' },
      { pattern: 'wp-includes', confidence: 0.9, type: 'content' }
    ]
  },
  
  // Analytics & Marketing
  { 
    name: 'Google Analytics', 
    category: 'analytics', 
    patterns: [
      { pattern: 'google-analytics', confidence: 0.3, type: 'content' },
      { pattern: 'ga.js', confidence: 0.8, type: 'script' },
      { pattern: 'gtag', confidence: 0.9, type: 'script' }
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
      { pattern: 'nginx', confidence: 0.9, type: 'content' },
      { pattern: 'nginx.conf', confidence: 0.9, type: 'content' }
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
  }
];

interface DetectedTech {
  name: string;
  confidence: number;
  evidence: string[];
}

function detectTechnologies(html: string, headers: Headers): { [key: string]: DetectedTech[] } {
  const detected: { [key: string]: DetectedTech[] } = {
    frontend: [],
    backend: [],
    cms: [],
    server: [],
    analytics: [],
    other: []
  };

  // Check HTML content
  techSignatures.forEach(tech => {
    let maxConfidence = 0;
    const evidence: string[] = [];

    tech.patterns.forEach(({ pattern, confidence, type }) => {
      let found = false;
      
      switch (type) {
        case 'script':
          found = html.includes(`<script src="${pattern}"`) || 
                 html.includes(`<script>${pattern}`);
          break;
        case 'meta':
          found = html.includes(`<meta name="${pattern}"`) || 
                 html.includes(`<meta property="${pattern}"`);
          break;
        case 'class':
          found = html.includes(`class="${pattern}"`) || 
                 html.includes(`class='${pattern}'`);
          break;
        case 'id':
          found = html.includes(`id="${pattern}"`) || 
                 html.includes(`id='${pattern}'`);
          break;
        case 'attribute':
          found = html.includes(`${pattern}=`);
          break;
        case 'header':
          const headerValue = headers.get(pattern);
          found = headerValue !== null && (
            pattern === 'X-Powered-By' ? headerValue.toLowerCase().includes('php') :
            headerValue.toLowerCase().includes(pattern.toLowerCase())
          );
          break;
        default:
          found = html.toLowerCase().includes(pattern.toLowerCase());
      }

      if (found) {
        maxConfidence = Math.max(maxConfidence, confidence);
        evidence.push(`${type}: ${pattern}`);
      }
    });

    if (maxConfidence > 0) {
      detected[tech.category].push({
        name: tech.name,
        confidence: maxConfidence,
        evidence
      });
    }
  });

  // Check server headers
  const serverHeader = headers.get('server');
  if (serverHeader) {
    if (serverHeader.toLowerCase().includes('nginx')) {
      detected.server.push({
        name: 'Nginx',
        confidence: 0.9,
        evidence: [`header: ${serverHeader}`]
      });
    } else if (serverHeader.toLowerCase().includes('apache')) {
      detected.server.push({
        name: 'Apache',
        confidence: 0.9,
        evidence: [`header: ${serverHeader}`]
      });
    }
  }

  // Sort by confidence
  Object.keys(detected).forEach(key => {
    detected[key].sort((a, b) => b.confidence - a.confidence);
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
      items: Object.entries(technologies).map(([category, techs]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: techs.length > 0 
          ? techs.map(tech => `${tech.name} (${Math.round(tech.confidence * 100)}% confidence)`).join(', ')
          : 'Not detected'
      }))
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